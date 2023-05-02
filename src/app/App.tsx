import React from 'react';

import '../index.css';
import '../css/selectize.css';
import '../css/selectize.default.css';
import '../css/photon.css';
import 'vanillatoasts/vanillatoasts.css';

import RequestContainer from './containers/RequestContainer';
import SettingsContainer from './containers/SettingsContainer';

export default function App(): JSX.Element {
  return (
    <div className="app">
      <RequestContainer />
    </div>
  );
}
