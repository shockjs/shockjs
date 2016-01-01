/**
 * @file Renders router on the client with history.
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { configureStore, browserHistory } from '../../shared/store/configureStore';
const store = configureStore();
const history = browserHistory();
import { Router } from 'react-router';
import DevTools from '../../shared/utils/DevTools';
import routes from '../../shared/routes';

class RouterComponent extends Component
{
  render() {
    return (
      <div>
        <Provider store={store}>
          <div>
            <Router history={history} routes={routes}></Router>
            <DevTools />
          </div>
        </Provider>
      </div>
    );
  }
}

export default RouterComponent;

