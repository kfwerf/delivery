import React from "react";

import '../index.css';
import '../css/selectize.css';
import '../css/selectize.default.css';
import '../css/photon.css';
import 'vanillatoasts/vanillatoasts.css';

import RequestContainer from "./containers/RequestContainer";

export default function App() {
    return (
        <div className="app">
            <RequestContainer />
        </div>
    );
}