/* @flow */
/* global google */

import React, { Component } from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';

declare var google: Object;

export const GOOGLE_MAPS_API_KEY = "AIzaSyD8MgbUf8RGv05GJ6qjrPLRg3Fvb4HTA9k";

// Initialize the higher order components and set their defaults below
const MainMap = withGoogleMap(class extends Component {

  _map: Object;

  // TODO: Remove after https://github.com/facebook/flow/issues/3008 is resolved
  static set defaultProps(dummy) {
    // zzz
  }

  // Keep a reference to the google maps object for things that don't natively tie into react
  handleMapMounted = (map) => {
    this._map = map;
  }

  // re-fire this event with what the bounds/center values changed to, rather than.. nothing?
  handleBoundsChanged = () => {
    return this.props.viewportHasUpdated
      && this.props.viewportHasUpdated(this._map.getCenter(), this._map.getBounds());
  }

  static get defaultProps() {
    return {
      defaultZoom: 3,
      defaultCenter: { lat: -25.363882, lng: 131.044922 },
      options: {
        disableDefaultUI: true,
        draggable: true,
        scrollwheel: true,
        panControl: false,
        mapTypeControl: false,
        scaleControl: false,
        styles: [
          {
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
    }
  }

  render() {
    return (<GoogleMap
      ref={this.handleMapMounted}
      onBoundsChanged={this.handleBoundsChanged}
      {...this.props}
    />)
  }
});

// These are set separately because they apply to the withGoogle HOC
MainMap.defaultProps = {
  containerElement: (<div style={{ height: `100%` }} />),
  mapElement: (<div id="map" />)
}

export default MainMap;

