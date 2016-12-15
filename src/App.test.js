/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { State } from './State';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App store={new State()} />, div);
});
