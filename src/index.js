/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.css';
import scriptjs from 'scriptjs';
import { GOOGLE_MAPS_API_KEY } from './components/Map';

// Don't render until we have google maps loaded
window.whenGoogleMapsIsLoaded = () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}

// Now load google maps
scriptjs(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=whenGoogleMapsIsLoaded`)