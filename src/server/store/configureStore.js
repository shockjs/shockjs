/**
 * Central Store (Server)
 */
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';

//Load in our reducers.
import * as reducers from '../../shared/js/reducers/index';

let createStoreWithMiddleware;

createStoreWithMiddleware = compose(
  applyMiddleware(thunkMiddleware)
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
  return createStoreWithMiddleware(rootReducer, initialState);
}
