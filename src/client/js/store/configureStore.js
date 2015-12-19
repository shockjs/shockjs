/**
 * Central Store (Server)
 */
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import { reducer as formReducer } from 'redux-form';

import { persistState } from 'redux-devtools';
import DevTools from '../../../shared/js/utils/DevTools';

import createBrowserHistory from 'history/lib/createBrowserHistory';

//Load in our reducers.
import * as reducers from '../../../shared/js/reducers/index';


const rootReducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer,
  form: formReducer
}));

const finalCreateStore = compose(
    applyMiddleware(thunkMiddleware),
    DevTools.instrument()
)(createStore);

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
        store.replaceReducer(require('../reducers')/*.default if you use Babel 6+ */)
    );
  }

  syncReduxAndRouter(history, store);

  return store;
}

const history = createBrowserHistory();

export function browserHistory() {
  return history;
}

