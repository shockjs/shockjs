"use strict";

import { fetch, redirect, parseServerData } from '../utils/IsoBridge';
import * as ActionTypes from '../constants/ActionTypes';
import QueryBuilder from '../classes/QueryBuilder';

let defaultState = {

};

/**
 * Logs user out of website.
 *
 * @returns {QueryBuilder}
 */
function logoutUserApi() {
  return new QueryBuilder(`/api/v1/auth/logout`)
    .fetch();
}

/**
 * Updates the authentication for the current user.
 *
 * @param auth The data to update with.
 * @returns {{object}}
 */
export function updateAuth(auth) {
  return {
    type: ActionTypes.UPDATE_AUTH,
    ...auth
  };
}

/**
 * Fetches the current session.
 *
 * @returns {*}
 */
export function fetchAuthApi() {
  return new QueryBuilder(`/api/v1/auth/session`)
    .fetch();
}

/**
 * Fetches the current session through the dispatch.
 *
 * @returns {Function}
 */
export function fetchAuth() {
  return dispatch => {
    return fetchAuthApi()
      .then(auth => dispatch({
        type: ActionTypes.UPDATE_AUTH,
        ...auth
      }));
  };
}

/**
 * Logs user out of website.
 *
 * @returns {Function}
 */
export function logoutUser() {
  return (dispatch) => {
    return new Promise((resolve) => {
      logoutUserApi()
        .then(() => fetchAuthApi())
        .then((auth) => {
          resolve(dispatch({
            type: ActionTypes.UPDATE_AUTH,
            ...auth
          }));
          redirect('/login');
        });
    });
  };
}

/**
 * App Reducer
 *
 * @param {object} state The existing or default state.
 * @param {object} action The action specified.
 * @returns {object} The new state
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.INIT:
      return parseServerData('App', state);
    case ActionTypes.UPDATE_AUTH:
      return Object.assign({}, state, action);
    default:
      return state;
  }
}
