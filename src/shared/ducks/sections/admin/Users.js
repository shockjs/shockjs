"use strict";

import { fetch, parseServerData, clearServerData } from '../../../utils/IsoBridge';
import Base from '../../../../client/models/Base';
import { getUser } from '../../../models/User';
import forOwn from 'lodash/object/forOwn';
import QueryBuilder from '../../../classes/QueryBuilder';
import * as ActionTypes from '../../../constants/ActionTypes';
import findIndex from 'lodash/array/findIndex';

let defaultState = {
  users: false,
  renderedServer: false
};

/**
 * Action: Set that a data request is underway.
 *
 * @returns {{type}}
 */
function requestData() {
  return {
    type: ActionTypes.DATA_REQUESTED
  };
}

/**
 * Action: When data has been received.
 *
 * @param json
 * @returns {{type, users: *, receivedAt: number}}
 */
function receiveData(json) {
  return {
    type: ActionTypes.DATA_FETCHED,
    users: json,
    receivedAt: Date.now()
  };
}

/**
 * Query for fetching the list of users.
 *
 * @param page
 * @returns {Promise}
 */
function fetchUsersApi(page=1) {
  return new QueryBuilder(`/api/v1/users`)
    .addParam('page', page)
    .addParam('per-page', 5)
    .fetchList();
}

/**
 * Query for updating user.
 *
 * @param key
 * @param value
 * @returns {*}
 */
function updateUserApi(key, value) {
  return new QueryBuilder(`/api/v1/users/${key}`)
    .addParam('active', value)
    .update();
}

/**
 * Query for removing user.
 *
 * @param key
 * @returns {*}
 */
function removeUserApi(key) {
  return new QueryBuilder(`/api/v1/users/${key}`)
    .remove();
}

function receivePermissionData(user_id, json) {
  return {
    type: ActionTypes.PERMISSION_DATA_FETCHED,
    user_id: user_id,
    permissions: json
  };
}

/**
 * Action: Renders server side data.
 *
 * @returns {Promise}
 */
export function renderServer() {
  return fetchUsersApi()
    .then(function(json) {
      return { users: json };
    });
}

/**
 * Action: Remove rendered from server when route changes.
 *
 * @returns {{type}}
 */
export function cleanupServer() {
  return {
    type: ActionTypes.CLEAR_SERVER_DATA
  };
}

/**
 * Action: Fetches all users.
 *
 * @param page
 * @returns {Function}
 */
export function fetchUsers(page) {
  return dispatch => {
    dispatch(requestData());
    return fetchUsersApi(page)
      .then(json => dispatch(receiveData(json)));
  };
}

/**
 * Action: Updates the a specific user.
 *
 * @param key
 * @param value
 * @returns {Function}
 */
export function updateUser(key, value) {
  return dispatch => {
    return updateUserApi(key, value)
      .then(() => dispatch(fetchUsers()));
  };
}

/**
 * Action: Open user dialog.
 *
 * @returns {{type, showModal: boolean}}
 */
export function openUserModal() {
  return {
    type: ActionTypes.OPEN_MODAL,
    showModal: true
  };
}

/**
 * Action: Close user dialog.
 *
 * @returns {{type, showModal: boolean}}
 */
export function closeUserModal() {
  return {
    type: ActionTypes.CLOSE_MODAL,
    showModal: false
  };
}

/**
 * Action: Removes a user.
 *
 * @param key
 * @returns {Function}
 */
export function removeUser(key) {
  return dispatch => {
    return removeUserApi(key)
      .then(() => dispatch(fetchUsers()));
  };
}

export function fetchPermissions(key, toggle) {
  if (toggle === undefined) {
    return dispatch => {
      return new QueryBuilder(`/api/v1/auth-assignment`)
        .addParam('filters', [{name: 'userID', value: key}])
        .addParam('relations', [{name: 'authType'}])
        .fetch()
        .then(json => dispatch(receivePermissionData(key, json)));
    }
  } else {
    return {
      type: ActionTypes.PERMISSION_DATA_FETCHED,
      user_id: key,
      showPermissions: !toggle
    };
  }
}

export function removePermission(id) {
  return new QueryBuilder(`/api/v1/auth-assignment/${id}`)
    .remove()
    .then(() => {
      return dispatch => {
        //fetchPermissions()
      }
    });
}

/**
 * Action: Submit the new user form.
 *
 * @param values
 * @param dispatch
 * @returns {Promise}
 */
export function submitForm(values, dispatch) {
  return new Promise((resolve, reject) => {
    const User = getUser(Base);
    const userInstance = new User(values);
    userInstance.save()
      .then(() => {
        dispatch(fetchUsers(1));
        resolve(true);
      })
      .catch((err) => {
        let errors = {};
        forOwn(err.errors, (value, key) => {
          errors[key] = value.message;
        });
        reject(errors);
      });
  });
}

export function openPermissionModal(id)
{
  return {
    type: ActionTypes.OPEN_PERMISSIONS_MODAL,
    isPermissionsModalShown: true,
    id: id
  }
}

export function closePermissionModal()
{
  return {
    type: ActionTypes.CLOSE_PERMISSIONS_MODAL,
    isPermissionsModalShown: false
  }
}

/**
 * Users Reducer
 *
 * @param {object} state The existing or default state.
 * @param {object} action The action specified.
 * @returns {object} The new state
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.DATA_FETCHED:
      return Object.assign({}, state, {
        users: action.users || false,
        showModal: false
      });
    case ActionTypes.PERMISSION_DATA_FETCHED:
      let users = state.users;
      const userIndex = findIndex(state.users.payload, (user) => user.id === action.user_id);
      if (userIndex !== -1) {
        if (action.permissions) {
          users.payload[userIndex].permissions = action.permissions;
          users.payload[userIndex].showPermissions = true;
        } else {
          users.payload[userIndex].showPermissions = action.showPermissions;
        }
      }
      return {
        users: users,
        time: Date.now() //Always triggers a re-render.
      };
    case ActionTypes.OPEN_PERMISSIONS_MODAL:
    case ActionTypes.CLOSE_PERMISSIONS_MODAL:
      return Object.assign({}, state, {
        isPermissionsModalShown: action.isPermissionsModalShown != undefined
          ? action.isPermissionsModalShown
          : state.isPermissionsModalShown,
        time: Date.now() //Always triggers a re-render.
      });
    case ActionTypes.OPEN_MODAL:
    case ActionTypes.CLOSE_MODAL:
      return Object.assign({}, state, {
        showModal: action.showModal
      });
    case ActionTypes.CLEAR_SERVER_DATA:
      return clearServerData('Users', state);
    case ActionTypes.INIT:
      return parseServerData('Users', state);
    default:
      return state;
  }
}