/* @flow */

import { observable, action, intercept, when, reaction, computed } from 'mobx';
import Geolocator from 'geolocator';
import { GOOGLE_MAPS_API_KEY } from './components/Map';
import { getOsmNodes, getRandomWalkFromOsmDataset, normalizePathDifficulty } from './api/osm';

import type { Coordinates, Bounds, Walk, WalkId } from './Types';

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

  // What the viewport is currently centered on
  @observable viewportCenter: Coordinates = this.currentLocation;
  @observable viewportBounds: Bounds = { ne: this.currentLocation, sw: this.currentLocation };
  @observable viewportZoom: number = 5;

  // The location we were at when we loaded the walk (as opposed to where we are right now)
  @observable startingLocation: Coordinates = this.currentLocation;

  @observable targetLength: number = DEFAULT_ROUTE_TARGET_LENGTH;
  @observable currentWalk: ?Walk;
  @observable currentWalkId: WalkId = this.getIdFromUrl();

  @computed get walkStartingPoint(): Coordinates | null {
    if (!this.currentWalk) {
      return null;
    }

    return this.currentWalk.nodePath[0];
  }

  @action.bound wantLongerWalk() {
    this.targetLength *= ROUTE_LENGTHENING_PERCENTAGE;
  }

  @action.bound wantShorterWalk() {
    this.targetLength /= ROUTE_LENGTHENING_PERCENTAGE;
  }

  @action.bound successfulGeolocation(location: Object, zoomLevel: number) {
    this.locationLoaded = true;
    this.currentLocation = {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    }
    this.viewportZoom = zoomLevel;
  }

  @action.bound loadWalkId(walkId: WalkId) {
    this.currentWalkId = walkId;
    window.location.hash = walkId;
  }

  @action.bound updateCurrentWalk(walk: Walk) {
    this.loadWalkId(walk.id);
    this.currentWalk = walk;
    this.startingLocation = this.currentLocation;
  }

  @action.bound findAnotherWalk() {
    this.currentWalk = undefined;
  }

  @action.bound updateViewport(center: Coordinates, bounds: ?Bounds) {
    this.viewportCenter = center;

    if (bounds) {
      this.viewportBounds = bounds;
    }
  }

  @action.bound failedGeolocation() {
    this.locationLoaded = true;
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
                // TODO: present "enter your location" box?
                console.log(`Geolocation IP error: ${err}`);
                this.failedGeolocation();
                return;
              }
              this.successfulGeolocation(location, 12);
            });
            return;
          }
          this.successfulGeolocation(location, 12);
        });
      }
    );

    when("the first time our location has been found, move our viewport to it",
      () => this.locationLoaded,
      () => {
        this.updateViewport(this.currentLocation);
      }
    );

    // Load a new walk when we don't have a current walk
    reaction(
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
      },
      { name: "Load a new walk when we don't have a current walk" }
    );

    // Look for a new walk when we change target length
    reaction(
      () => this.targetLength,
      () => this.findAnotherWalk(),
      { name: "Look for a new walk when we change target length" }
    );

    window.addEventListener('hashchange', () => {
      this.loadWalkId(this.getIdFromUrl());
    });
  }
}

export default new State();