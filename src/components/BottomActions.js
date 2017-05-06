/* @flow */

import React from 'react';
import FacebookProvider, { Share } from 'react-facebook';

type Props = {
  onTooShortClick: Function,
  onTooLongClick: Function
}

const FB_APP_ID = process.env.NODE_ENV === 'development' ? '206742363104102' : '206735286438143';

export default (props: Props) => (
  <div className="filter-map-buttons">
    <FacebookProvider appID={FB_APP_ID}>
      <Share href={window.location.href} redirectURI={window.location.href} >
        <button className="submit lets-do-it">Find Friends!</button>
      </Share>
    </FacebookProvider>
    <div className="other-buttons">
      <button className="length" onClick={props.onTooShortClick} >Too Short</button>
      <button className="length" onClick={props.onTooLongClick} >Too Long</button>
    </div>
  </div>
)