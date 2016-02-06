"use strict";

import { fetch, redirect, parseServerData } from '../../../utils/IsoBridge';
import * as ActionTypes from '../../../constants/ActionTypes';
import QueryBuilder from '../../../classes/QueryBuilder';

let defaultState = {
  userCount: 0,
  roleCount: 0,
  renderedServer: false
};

/**
 * Sets the state to fetching data.
 * @returns {{type}}
 */
function requestData() {
  return {
    type: ActionTypes.DATA_REQUESTED
  };
}

/**
 * Settings the state to received data.
 * @param json
 * @returns {{type, receivedAt: number}}
 */
function receiveData(json) {
  return {
    type: ActionTypes.DATA_FETCHED,
    ...json,
    receivedAt: Date.now()
  };
}

/**
 * Fetches the count for all users in the system.
 * @returns {QueryBuilder}
 */
function fetchUserCountApi() {
  return new QueryBuilder(`/api/v1/users/count`)
    .fetch();
}

/**
 * Fetches the count for all roles in the system.
 * @returns {Promise}
 */
function fetchRoleCountApi() {
  return new QueryBuilder(`/api/v1/auth-type/count`)
    .addParam('filters', [
      {
        "name": "type",
        "value": 1
      }
    ])
    .fetch();
}

/**
 * Fetches all counts in a single promise.
 * @returns {Promise}
 */
function fetchCountsApi() {
  return new Promise((resolve) => {
    const fetchUserCount =  fetchUserCountApi();
    const fetchRoleCount =  fetchRoleCountApi();

    Promise.all([fetchUserCount, fetchRoleCount])
      .then(({ 0: userCount, 1: roleCount }) =>  {
        resolve({ userCount: userCount, roleCount: roleCount })
      });
  });
}

/**
 * Fetches the promise for server side rendering.
 */
export function renderServer() {
  return fetchCountsApi();
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
 * Dispatches all counts.
 * @returns {Function}
 */
export function fetchCounts() {
  return dispatch => {
    dispatch(requestData());
    return fetchCountsApi()
      .then(json => dispatch(receiveData(json)));
  };
}

/**
 * Dashboard Reducer
 *
 * @param {object} state The existing or default state.
 * @param {object} action The action specified.
 * @returns {object} The new state
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.DATA_FETCHED:
      return Object.assign({}, state, {
        userCount: action.userCount || 0,
        roleCount: action.roleCount || 0
      });
    default:
      return parseServerData('Dashboard', state);
  }
}