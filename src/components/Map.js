/* @flow */

import React from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';

// Initialize the higher order components and set their defaults below
const MapBoilerplate = withScriptjs(withGoogleMap(props => (
  <GoogleMap
    {...props}
  />
)));

MapBoilerplate.defaultProps = {
  googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD8MgbUf8RGv05GJ6qjrPLRg3Fvb4HTA9k",
  defaultZoom: 3,
  defaultCenter: { lat: -25.363882, lng: 131.044922 },
  loadingElement: (<div />),
  containerElement: (<div style={{ height: `100%` }} />),
  mapElement: (<div id="map" />)
}

// Actually fill in our app-specific defaults here
export default MapBoilerplate;

