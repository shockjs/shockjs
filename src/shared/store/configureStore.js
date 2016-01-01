/**
 * Central Store (Server)
 */
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import { reducer as formReducer } from 'redux-form';
import { isServer } from '../utils/isomorphic';
import DevTools from '../utils/DevTools';

//Load in our reducers.
import * as reducers from '../reducers/index';


const rootReducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer,
  form: formReducer
}));

const applyStore = [
  applyMiddleware(thunkMiddleware)
];

// Add the devtools if we are in development mode.
if (process.env.SHOCK_ENV === 'development') {
  applyStore.push(DevTools.instrument());
}

const finalCreateStore = compose(...applyStore)(createStore);

let history = false;

//Only load history on client.
if (!isServer()) {
  let createBrowserHistory = require('history/lib/createBrowserHistory');
  history = createBrowserHistory();
}

/**
 * Configures the store.
 * @param initialState
 * @returns {*}
 */
export function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
        store.replaceReducer(require('../reducers/index')/*.default if you use Babel 6+ */)
    );
  }

  // Make sure history exists in case loaded serverside.
  if (history) {
    syncReduxAndRouter(history, store);
  }

  return store;
}

export function browserHistory() {
  return history;
}


