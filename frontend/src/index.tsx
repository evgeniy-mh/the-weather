import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { AppConnected } from "./components/App";
import { AppReducer } from "./components/Reducers";
import { fetchSensorInfoSuccess, fetchSensorInfoStart, fetchSensorInfoFail } from "./components/Actions";

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(AppReducer, composeEnhancers(applyMiddleware(thunk)));

store.dispatch(fetchSensorInfoStart());
store.dispatch(fetchSensorInfoSuccess({ co2: 50, humidity: 60, temperature: 70 }));
store.dispatch(fetchSensorInfoFail())

ReactDOM.render(
    <Provider store={store}>
        <AppConnected />
    </Provider>,
    document.getElementById("root")
);
