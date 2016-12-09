/* @flow */
/* global google */

import React, { Component } from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';

export type Coordinates = {lat: number, lng: number}
declare var google: Object;

type Props = {
  options?: Object
}

// Initialize the higher order components and set their defaults below
const MapBoilerplate = withScriptjs(withGoogleMap(class extends Component {
  props: Props

  state: {
    mapOptions?: Object
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      mapOptions: {}
    }
  }

  componentDidMount() {
    // We need to wait for the google api to load before we can use the google.maps constants
    const DEFAULT_GOOGLE_MAP_OPTIONS = {
      disableDefaultUI: true,
      draggable: true,
      scrollwheel: true,
      panControl: false,
      mapTypeControl: false,
      scaleControl: false,
      styles: [{
              "elementType": "geometry",
              "stylers": [{
                  "color": "#f5f5f5"
              }]
          },
          {
              "elementType": "labels.icon",
              "stylers": [{
                  "visibility": "off"
              }]
          },
          {
              "elementType": "labels.text.fill",
              "stylers": [{
                  "color": "#616161"
              }]
          },
          {
              "elementType": "labels.text.stroke",
              "stylers": [{
                  "color": "#f5f5f5"
              }]
          },
          {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [{
                  "color": "#bdbdbd"
              }]
          },
          {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#eeeeee"
              }]
          },
          {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [{
                  "color": "#757575"
              }]
          },
          {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#e5e5e5"
              }]
          },
          {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [{
                  "color": "#9e9e9e"
              }]
          },
          {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#ffffff"
              }]
          },
          {
              "featureType": "road.arterial",
              "elementType": "labels.text.fill",
              "stylers": [{
                  "color": "#757575"
              }]
          },
          {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#dadada"
              }]
          },
          {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [{
                  "color": "#616161"
              }]
          },
          {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [{
                  "color": "#9e9e9e"
              }]
          },
          {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#e5e5e5"
              }]
          },
          {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#eeeeee"
              }]
          },
          {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{
                  "color": "#c9c9c9"
              }]
          },
          {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [{
                  "color": "#9e9e9e"
              }]
          }
      ],
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.setState({mapOptions: DEFAULT_GOOGLE_MAP_OPTIONS})
  }

  render() {
    return (<GoogleMap
      {...this.props}
      options={{...this.state.mapOptions, ...this.props.options}}
    />) 
  }
}));

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

