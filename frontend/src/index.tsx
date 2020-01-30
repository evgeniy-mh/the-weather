import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import { AppConnected } from "./components/App/App";
import { AppReducer } from "./Reducers";

// true - frontend server on localhost, esp server on esp device
// false - frontend server on esp device, esp server on esp device
const frontEndServerOnESP = false;

export function getServerURL(): string {
    return frontEndServerOnESP
        ? ''
        : 'http://192.168.0.100';
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(AppReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

ReactDOM.render(
    <Provider store={store}>
        <AppConnected />
    </Provider>,
    document.getElementById("root")
);
