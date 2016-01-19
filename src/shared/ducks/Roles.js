"use strict";

import { fetch, parseServerData, clearServerData } from '../utils/IsoBridge';
import QueryBuilder from '../classes/QueryBuilder';
import * as ActionTypes from '../constants/ActionTypes';

let defaultState = {
  roles: false,
  renderedServer: false
};

/**
 * Requesting data
 *
 * @returns {{type}}
 */
function requestData() {
  return {
    type: ActionTypes.DATA_REQUESTED
  };
}

/**
 * When data received.
 *
 * @param json
 * @returns {{type, roles: *, receivedAt: number}}
 */
function receiveData(json) {
  return {
    type: ActionTypes.DATA_FETCHED,
    roles: json,
    receivedAt: Date.now()
  };
}

/**
 * Fetches the roles.
 *
 * @param page
 * @returns {Promise}
 */
function fetchRolesApi(page=1) {
  return new QueryBuilder('/api/v1/auth-type')
    .addParam('page', page)
    .addParam('filters', {
      name: "type",
      value: 1
    })
    .fetchList();
}

/**
 * Fetches the promise for server side rendering.
 */
export function renderServer() {
  return fetchRolesApi().then(function(json) {
    return { roles: json };
  });
}

/**
 * Removes server data when navigating to different route.
 * @returns {{type}}
 */
export function cleanupServer() {
  return {
    type: ActionTypes.CLEAR_SERVER_DATA
  };
}

/**
 * Fetches and dispatches role data.
 * @param page
 * @returns {Function}
 */
export function fetchRoles(page) {
  return dispatch => {
    dispatch(requestData());
    return fetchRolesApi(page)
      .then(json => dispatch(receiveData(json)));
  };
}

/**
 * Roles Reducer
 *
 * @param {object} state The existing or default state.
 * @param {object} action The action specified.
 * @returns {object} The new state
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.DATA_FETCHED:
      return Object.assign({}, state, {
        roles: action.roles || false
      });
    default:
      return parseServerData('Roles', state);
  }
}

