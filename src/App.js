/* @flow */
/* global google */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Map from './components/Map';
import Directions from './components/Map/Directions';
import Header from './components/Header';
import BottomActions from './components/BottomActions';
import Footer from './components/Footer';
import { Marker, Polyline } from 'react-google-maps';

import { State } from './State';

import driveIcon from './styles/images/drive.svg';
import walkIcon from './styles/images/walk.svg';

import DevTools from 'mobx-react-devtools';

import './styles/app.css';
import './styles/fonts.css';

// TODO: something better than this
declare var google: Object;

type Props = {
  store: State
}

@observer
class App extends Component {

  props: Props

  renderCurrentWalk = () => {
    if (!this.props.store.currentWalk) {
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
        path={this.props.store.currentWalk.nodePath}
        />,
      <Directions
        key="directionsToWalk"
        from={this.props.store.startingLocation}
        to={this.props.store.walkStartingPoint}
        />,
      <Marker
        key="walkStartMarker"
        position={this.props.store.currentWalk.nodePath[0]}
        icon={{ url: walkIcon, scaledSize: new google.maps.Size(30, 41.43) }}
        />
    ];
  }

  renderMapFeatures = () => ([
    <Marker
      key="currentLocationMarker"
      position={this.props.store.currentLocation}
      icon={{ url: driveIcon, scaledSize: new google.maps.Size(30, 41.43) }}
      />,
    ...this.renderCurrentWalk()
  ])

  render() {
    return (
      <div className="site-container">
        <Header
          walk={this.props.store.currentWalk}
          />

        <Map zoom={this.props.store.zoom}>
          {this.props.store.locationLoaded && this.renderMapFeatures()}
        </Map>

        <BottomActions
          onTooShortClick={this.props.store.wantLongerWalk}
          onTooLongClick={this.props.store.wantShorterWalk}
          />

        <Footer />

        {process.env.NODE_ENV === 'development' ? <DevTools /> : null}
      </div>
    );
  }
}

export default App;
