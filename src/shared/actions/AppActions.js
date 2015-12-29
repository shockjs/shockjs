"use strict";

import { fetch, redirect } from '../utils/isomorphic'
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
export function fetchAuthApi() {
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
      .then(auth => dispatch({
        type: UPDATE_AUTH,
        ...auth
      }))
  }
}

function logoutUserApi() {
  return fetch(`/api/v1/auth/logout`)
    .then(req => req.json());
}

export function logoutUser() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      logoutUserApi()
        .then(json => fetchAuthApi())
        .then((auth) => {
          resolve(dispatch({
            type: UPDATE_AUTH,
            ...auth
          }));
          redirect('/login');
        });
    });
  }
}