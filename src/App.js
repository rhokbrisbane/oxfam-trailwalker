/* @flow */
/* global google */

import React, { Component } from 'react';
import Geolocator from 'geolocator';
import Map, { GOOGLE_MAPS_API_KEY } from './components/Map';
import Directions from './components/Map/Directions';
import Header from './components/Header';
import { Marker, Polyline } from 'react-google-maps';

import { getOsmNodes, getRandomWalkFromOsmDataset, normalizePathDifficulty } from './api/osm';

import driveIcon from './styles/images/drive.svg';
import walkIcon from './styles/images/walk.svg';

import './styles/app.css';
import './styles/fonts.css';

import type { Coordinates } from './components/Map';

// workaround https://github.com/onury/geolocator/issues/42
window.geolocator = Geolocator;

// TODO: something better than this
declare var google: Object;

type Props = {}

export type Walk = {
  trailName?: string,
  distance: number,
  difficulty?: string,
  nodePath: Array<Coordinates>
}

// Constants
const ROUTE_LENGTHENING_PERCENTAGE = 1.5;
const KM_RADIUS_TO_SEARCH_FOR_NEARBY_ROUTES = 0.25;
const DEFAULT_ROUTE_TARGET_LENGTH = 5 /* km */;

// TODO: make these dynamic, calculated by the shortest/longest walks in the available dataset
const MINIMUM_ROUTE_LENGTH = 0.5;
const MAXIMUM_ROUTE_LENGTH = 5;

Geolocator.config({
  google: {
    key: GOOGLE_MAPS_API_KEY
  }
})

class App extends Component {

  props: Props

  state: {
    currentLocation: Coordinates,
    locationLoaded: boolean,
    zoom: number,
    targetLength: number,
    currentWalk?: Walk,
    loadedWalks?: {[key: string]: Walk},
    directionsToCurrentWalk?: Object
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      currentLocation: {lat: -27.6191977, lng: 133.2716991},
      locationLoaded: false,
      zoom: 5,
      targetLength: DEFAULT_ROUTE_TARGET_LENGTH
    }
  }

  componentDidMount() {
    this.findUsersCurrentLocation();
  }

  updateTargetLength = (length: number) => {
    const normalizedLength = Math.max(Math.min(length, MAXIMUM_ROUTE_LENGTH), MINIMUM_ROUTE_LENGTH);

    this.setState({targetLength: normalizedLength})
    this.getRandomWalk(this.state.currentLocation, normalizedLength);
  }
  makeTargetLengthLonger = () => this.updateTargetLength(this.state.targetLength * ROUTE_LENGTHENING_PERCENTAGE)
  makeTargetLengthShorter = () => this.updateTargetLength(this.state.targetLength / ROUTE_LENGTHENING_PERCENTAGE)

  findUsersCurrentLocation = () => {
    // This makes a callback function which updates the map at the callback location at a given zoom level
    const updateFromLocation = (zoomLevel) => (err, location) => {
      if (err) {
        // TODO: Maybe this can fallback to asking the user for their postcode?
        console.log("Geolocation error: ", err);
        return;
      }

      const locationCoordinates = {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      }

      this.setState({
        zoom: zoomLevel,
        currentLocation: locationCoordinates,
        locationLoaded: true
      });

      this.getRandomWalk(locationCoordinates, this.state.targetLength);
    }

    Geolocator.locateByIP({}, (err, location) => {
      updateFromLocation(12)(err, location);

      Geolocator.watch({ maximumAge: 6000}, updateFromLocation(13));
    });
  }

  getRandomWalk = (currentLocation: Coordinates, targetLength: number) => {
    getOsmNodes(
      currentLocation.lat - KM_RADIUS_TO_SEARCH_FOR_NEARBY_ROUTES,
      currentLocation.lng - KM_RADIUS_TO_SEARCH_FOR_NEARBY_ROUTES,
      currentLocation.lat + KM_RADIUS_TO_SEARCH_FOR_NEARBY_ROUTES, 
      currentLocation.lng + KM_RADIUS_TO_SEARCH_FOR_NEARBY_ROUTES, 
      (data) => {
        let randomWalk = getRandomWalkFromOsmDataset(data, targetLength);

        if (!randomWalk) {
          return;
        }

        this.setState({
          currentWalk: {
            trailName: randomWalk.tags.name,
            distance: randomWalk.tags.distance,
            difficulty: normalizePathDifficulty(randomWalk.tags.sac_scale),
            nodePath: randomWalk.nodes
          }
        });
      })
  }

  renderCurrentWalk = () => {
    if (!this.state.currentWalk) {
      return [];
    }

    return [
      <Polyline
        key="walkPath"
        options={{
          geodesic: true,
          strokeColor: "#50af47",
          strokeOpacity: 0.5,
          strokeWeight: 10
        }}
        path={this.state.currentWalk.nodePath}
      />,
      <Directions
        key="directionsToWalk"
        from={this.state.currentLocation}
        to={this.state.currentWalk.nodePath[0]}
      />,
      <Marker 
        key="walkStartMarker"
        position={this.state.currentWalk.nodePath[0]}
        icon={{url: walkIcon, scaledSize: new google.maps.Size(30, 41.43)}}
      />
    ];
  }

  renderMapFeatures = () => ([
    <Marker
      key="currentLocationMarker"
      position={this.state.currentLocation}
      icon={{url: driveIcon, scaledSize: new google.maps.Size(30, 41.43)}}
    />,
    ...this.renderCurrentWalk()
  ])

  render() {
    return (
      <div className="site-container">
          <Header 
            walk={this.state.currentWalk}
          />

          <div className="filter-social-icons">
              <a href="https://www.facebook.com/Find-Me-A-Walk-1610148005948849/" target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook" aria-hidden="true"></i></a>
              <a href="https://www.instagram.com/findmeawalk/" target="_blank" rel="noopener noreferrer"><i className="fa fa-instagram" aria-hidden="true"></i></a>
              <a href="https://twitter.com/FindMeAWalk" target="_blank" rel="noopener noreferrer"><i className="fa fa-twitter" aria-hidden="true"></i></a>
              <a href="https://github.com/rhokbrisbane/oxfam-trailwalker/" target="_blank" rel="noopener noreferrer" title="Help improve this app!"><i className="fa fa-github" aria-hidden="true"></i></a>
              <div className="filter-links">
                  <a href="http://blog.findmeawalk.com/" target="_blank"><span>Blog</span></a>
                  <a href="https://trailwalker.oxfam.org.au/" target="_blank"><span>Inspired by Oxfam Trailwalker</span></a>
              </div>
          </div>

          <div className="filter-map-buttons">
              <button className="submit lets-do-it">Find Friends!</button>
              <div className="other-buttons">
                  <button className="length" onClick={this.makeTargetLengthLonger} >Too Short</button>
                  <button className="length" onClick={this.makeTargetLengthShorter} >Too Long</button>
              </div>
          </div>

          <Map center={this.state.currentLocation} zoom={this.state.zoom}>
            { this.state.locationLoaded && this.renderMapFeatures() }
          </Map>

      </div>
    );
  }
}

export default App;
