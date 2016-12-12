/* @flow */
/* global google */

import React, { Component } from 'react';
import { DirectionsRenderer } from 'react-google-maps';

import type Coordinates from '../Map';
declare var google: Object;

type Props = {
  from: Coordinates,
  to: Coordinates
}

export default class extends Component {
  props: Props

  state: {
    directions?: Array<Object>
  }

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  updateDirections = () => {
    if (!this.props.from || !this.props.to) {
      this.setState({directions: undefined});
      return;
    }

    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: this.props.from,
      destination: this.props.to,
      travelMode: google.maps.TravelMode.WALKING,
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

  componentDidUpdate() {
    this.updateDirections();
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