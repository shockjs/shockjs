/**
 * @file Renders router on the client with history.
 */
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, browserHistory } from '../../../client/js/store/configureStore';
const store = configureStore();
const history = browserHistory();
import { Router, Route, Link, IndexRoute } from 'react-router';
import DevTools from '../utils/DevTools';
import routes from '../../routes'

export default React.createClass({
  render() {
    return (
      <div>
        <Provider store={store}>
          <div>
            <Router history={history} routes={routes}>
            </Router>
            <DevTools />
          </div>
        </Provider>
      </div>
    );
  }
});

