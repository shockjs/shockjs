"use strict";

import { fetch } from '../utils/isomorphic'
import { UPDATE_AUTH } from '../constants/ActionTypes';
import { browserHistory } from '../store/configureStore';

/**
 * Updates the authentication for the current user.
 *
 * @param auth The data to update with.
 * @returns {{object}}
 */
export function updateAuth(auth) {
  return {
    type: UPDATE_AUTH,
    ...auth
  };
}

/**
 * Fetches the current session.
 * @returns {*}
 */
function fetchAuthApi() {
  return fetch(`/api/v1/auth/session`)
    .then(req => req.json());
}

/**
 * Fetches the current session through the dispatch.
 * @returns {Function}
 */
export function fetchAuth() {
  return dispatch => {
    return fetchAuthApi()
      .then(json => dispatch(updateAuth(json)))
  }
}

function logoutUserApi() {
  return fetch(`/api/v1/auth/logout`)
    .then(req => req.json());
}

export function logoutUser() {
  return dispatch => {
    logoutUserApi()
      .then(json => dispatch(fetchAuth()));
  }
}