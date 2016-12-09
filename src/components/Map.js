/* @flow */

import React from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';

export type Coordinates = {lat: number, lng: number}

// Initialize the higher order components and set their defaults below
const MapBoilerplate = withScriptjs(withGoogleMap(props => (
  <GoogleMap
    {...props}
  />
)));

// Fill in enough defaults to get the map working
MapBoilerplate.defaultProps = {
  googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD8MgbUf8RGv05GJ6qjrPLRg3Fvb4HTA9k",
  defaultZoom: 3,
  defaultCenter: { lat: -25.363882, lng: 131.044922 },
  loadingElement: (<div />),
  containerElement: (<div style={{ height: `100%` }} />),
  mapElement: (<div id="map" />)
}

export default MapBoilerplate;

