/* @flow */

import React, { Component } from 'react';
import Map from './components/Map';
import headerIcon from './styles/images/icon.png';
import './styles/app.css';
import './styles/fonts.css';

type Props = {}

class App extends Component {

  props: Props

  constructor(props: Props) {
    super(props);
  }

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
                    <button className="length" id="too_short">Too Short</button><button className="length" id="too_long">Too Long</button>
                </div>
            </div>

            <Map />

        </div>
      </div>
    );
  }
}

export default App;
