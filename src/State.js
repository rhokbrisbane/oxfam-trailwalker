/* @flow */

import { observable, action, intercept, when, reaction, computed } from 'mobx';
import Geolocator from 'geolocator';
import { GOOGLE_MAPS_API_KEY } from './components/Map';
import { getOsmNodes, getRandomWalkFromOsmDataset, normalizePathDifficulty } from './api/osm';

import type { Coordinates, Walk, WalkId } from './Types';

const DEFAULT_ROUTE_TARGET_LENGTH = 5 /* km */;
const ROUTE_LENGTHENING_PERCENTAGE = 1.5;
const KM_RADIUS_TO_SEARCH_FOR_NEARBY_ROUTES = 0.25;

// TODO: make these dynamic, calculated by the shortest/longest walks in the available dataset
const MINIMUM_ROUTE_LENGTH = 0.5;
const MAXIMUM_ROUTE_LENGTH = 5;

// workaround https://github.com/onury/geolocator/issues/42
window.geolocator = Geolocator;

Geolocator.config({
  google: {
    key: GOOGLE_MAPS_API_KEY
  }
})

export class State {
  @observable currentLocation: Coordinates = { lat: -27.6191977, lng: 133.2716991 };
  @observable locationLoaded: boolean = false;
  @observable zoom: number = 5;
  @observable targetLength: number = DEFAULT_ROUTE_TARGET_LENGTH;
  @observable currentWalk: ?Walk;
  @observable currentWalkId: WalkId = this.getIdFromUrl();

  @computed get walkStartingPoint(): ?Coordinates {
    if(!this.currentWalk) {
  return null;
}

return this.currentWalk.nodePath[0];
  }

@action wantLongerWalk() {
  this.targetLength *= ROUTE_LENGTHENING_PERCENTAGE;
}

@action wantShorterWalk() {
  this.targetLength /= ROUTE_LENGTHENING_PERCENTAGE;
}

@action successfulGeolocation(location: Object, zoomLevel: number) {
  this.locationLoaded = true;
  this.currentLocation = {
    lat: location.coords.latitude,
    lng: location.coords.longitude
  }
  this.zoom = 12;
}

@action loadWalkId(walkId: WalkId) {
  this.currentWalkId = walkId;
  window.location.hash = walkId;
}

@action updateCurrentWalk(walk: Walk) {
  this.loadWalkId(walk.id);
  this.currentWalk = walk;
}

@action findAnotherWalk() {
  this.currentWalk = undefined;
}

getIdFromUrl() {
  const hashWithId = window.location.hash;
  return hashWithId.slice(1);
}

constructor() {
  // Normalize targetLength
  intercept(this, 'targetLength', (change) => {
    change.newValue = Math.max(Math.min(change.newValue, MAXIMUM_ROUTE_LENGTH), MINIMUM_ROUTE_LENGTH);
    return change;
  });

  when(
    "Find our our location when we don't have one",
    () => !this.locationLoaded,
    () => {
      Geolocator.watch({ maximumAge: 6000 }, (err, location) => {
        if (err) {
          console.log(`Geolocation watch error: ${err}, falling back to IP`);
          Geolocator.locateByIP({}, (err, location) => {
            if (err) {
              console.log(`Geolocation IP error: ${err}`);
              this.locationLoaded = true;
              return;
            }
            this.successfulGeolocation(location, 13);
          });
          return;
        }
        this.successfulGeolocation(location, 13);
      });
    }
  );

  reaction(
    "Load a new walk when we don't have a current walk",
    () => !this.currentWalk && this.locationLoaded,
    (valid) => {
      if (!valid) {
        return;
      }

      getOsmNodes(
        this.currentLocation.lat - KM_RADIUS_TO_SEARCH_FOR_NEARBY_ROUTES,
        this.currentLocation.lng - KM_RADIUS_TO_SEARCH_FOR_NEARBY_ROUTES,
        this.currentLocation.lat + KM_RADIUS_TO_SEARCH_FOR_NEARBY_ROUTES,
        this.currentLocation.lng + KM_RADIUS_TO_SEARCH_FOR_NEARBY_ROUTES,
        (data) => {
          let randomWalk = getRandomWalkFromOsmDataset(data, this.targetLength);

          if (!randomWalk) {
            console.log("No walks found - what do?");
            return;
          }

          const walk: Walk = {
            id: randomWalk.id,
            trailName: randomWalk.tags.name,
            distance: randomWalk.tags.distance,
            difficulty: normalizePathDifficulty(randomWalk.tags.sac_scale),
            nodePath: randomWalk.nodes
          }

          this.updateCurrentWalk(walk);
        })
    }
  );

  reaction(
    "Look for a new walk when we change the target length",
    () => this.targetLength,
    () => this.findAnotherWalk()
  );

  window.addEventListener('hashchange', () => {
    this.loadWalkId(this.getIdFromUrl());
  });
}
}

export default new State();