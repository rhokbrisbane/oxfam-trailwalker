/* @flow */

import React, { Component } from 'react';
import Map from './components/Map';
import headerIcon from './styles/images/icon.png';
import './styles/app.css';
import './styles/fonts.css';

import type Coordinates from './components/Map';

type Props = {}

// Constants
const ROUTE_LENGTHENING_PERCENTAGE = 1.5;
const DEFAULT_ROUTE_TARGET_LENGTH = 5 /* km */;

// TODO: make these dynamic, calculated by the shortest/longest walks in the available dataset
const MINIMUM_ROUTE_LENGTH = 0.5;
const MAXIMUM_ROUTE_LENGTH = 5;

class App extends Component {

  props: Props

  state: {
    currentLocation: Coordinates,
    targetLength: number
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      currentLocation: {lat: -27.6191977, lng: 133.2716991},
      targetLength: DEFAULT_ROUTE_TARGET_LENGTH,
    }
  }

  updateTargetLength = (length: number) => this.setState({targetLength: Math.max(Math.min(length, MAXIMUM_ROUTE_LENGTH), MINIMUM_ROUTE_LENGTH)})
  makeTargetLengthLonger = () => this.updateTargetLength(this.state.targetLength * ROUTE_LENGTHENING_PERCENTAGE)
  makeTargetLengthShorter = () => this.updateTargetLength(this.state.targetLength / ROUTE_LENGTHENING_PERCENTAGE)

  render() {
    return (
      <div>
        <div id="loading"><h1>Finding Walks...</h1></div>
        <div className="site-container">

            <div className="filter-search-box">
                <div className="filter-search-logo">
                    <h1>Find Me A Walk<img src={headerIcon} alt="Logo" /></h1>
                </div>
                <div className="filter-search-track-details">
                    <span id="trailName" className="filter-search-name">Track Name</span><span id="length" className="filter-search-length">Distance</span><span id='trailDifficutly' className="filter-search-difficulty">Difficulty</span>
                </div>
                <div className="filter-map-details">
                </div>
            </div>

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

            <Map center={this.state.currentLocation} defaultZoom={5} />

        </div>
      </div>
    );
  }
}

export default App;
