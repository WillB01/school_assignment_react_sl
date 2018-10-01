import "./css/site.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Home } from "./components/Home";
import { Depature } from './components/Depature';
import {CheckBox} from './components/CheckBox';

function renderApp(): void {
    ReactDOM.render(<AppContainer>
        <Home />
    </AppContainer>, document.getElementById("react-app"));
}

renderApp();

if (module.hot) {
    module.hot.accept('./components/Home', () => {
        renderApp();
    });
    module.hot.accept('./components/Stations', () => {
        renderApp();
    });
    module.hot.accept('./components/Depature', () => {
        renderApp();
    });
    module.hot.accept('./components/CheckBox', () => {
        renderApp();
    });


    
}
