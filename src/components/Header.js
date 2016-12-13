/* @flow */

import React from 'react';
import headerIcon from '../styles/images/icon.png';

import type { Walk } from '../App';

const DEFAULT_TRAIL_NAME = "Yours to discover!";

type Props = {
    walk?: Walk
}

export default (props: Props) => 
    <div className="filter-search-box">
        <div className="filter-search-logo">
            <h1>Find Me A Walk<img src={headerIcon} alt="Logo" /></h1>
        </div>
        <div className="filter-search-track-details">
            <span className="filter-search-name">{ props.walk ? (props.walk.trailName || DEFAULT_TRAIL_NAME) : "Finding Walks..." }</span>
            { props.walk && (<span className="filter-search-length">{ Math.round(props.walk.distance * 10) / 10 } km</span>) }
            { props.walk && props.walk.difficulty && (<span className="filter-search-difficulty">{ props.walk.difficulty }</span>) }
        </div>
        <div className="filter-map-details">
        </div>
    </div>