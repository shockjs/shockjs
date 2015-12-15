/**
 * Central Store (Server)
 */
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';

import {devTools, persistState} from 'redux-devtools';
import createBrowserHistory from 'history/lib/createBrowserHistory';

//Load in our reducers.
import * as reducers from '../../../shared/js/reducers/index';

let createStoreWithMiddleware;

createStoreWithMiddleware = compose(
  applyMiddleware(thunkMiddleware),
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);


const rootReducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer
}));

/**
 * Configures the store.
 * @param initialState
 * @returns {*}
 */
export function configureStore(initialState) {
  var store = createStoreWithMiddleware(rootReducer, initialState);
  syncReduxAndRouter(history, store);
  return store;
}

const history = createBrowserHistory();

export function browserHistory() {
  return history;
}

