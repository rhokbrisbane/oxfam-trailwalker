/* @flow */
/* global google */

import React from 'react';
import { DirectionsRenderer } from 'react-google-maps';
import { calcDistance } from 'geolocator';

import type Coordinates from '../Map';
declare var google: Object;

// Fetch walking directions for starting points closer than this value
const CLOSE_ENOUGH_TO_WALK_TO = 1 /* km */;

type Props = {
  from: Coordinates,
  to: Coordinates
}

export default class extends React.PureComponent {
  props: Props

  state: {
    directions?: Array<Object>
  }

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  updateDirections = (from: Coordinates, to: Coordinates) => {
    if (!from || !to) {
      this.setState({ directions: undefined });
      return;
    }

    const approximateDistanceToStart = calcDistance({
      from: { latitude: from.lat, longitude: from.lng },
      to: { latitude: to.lat, longitude: to.lng }
    });

    let travelMode = google.maps.TravelMode.DRIVING;
    if (approximateDistanceToStart < CLOSE_ENOUGH_TO_WALK_TO) {
      travelMode = google.maps.TravelMode.WALKING;
    }

    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: from,
      destination: to,
      travelMode: travelMode,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
        });
      } else {
        console.error(`error fetching directions (status: ${status}, result: ${result})`);
      }
    });
  }

  componentDidMount() {
    this.updateDirections(this.props.from, this.props.to);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.updateDirections(nextProps.from, nextProps.to);
  }

  render() {
    if (!this.state.directions) {
      return null;
    }

    return (
      <DirectionsRenderer
        directions={this.state.directions}
        options={{
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#e70052",
            strokeOpacity: 0.5,
            strokeWeight: 5,
          }
        }}
        />
    )
  }
}