"use strict";

import { fetch, parseServerData, clearServerData } from '../../../utils/IsoBridge';
import Base from '../../../../client/models/Base';
import QueryBuilder from '../../../classes/QueryBuilder';
import forOwn from 'lodash/object/forOwn';
import * as ActionTypes from '../../../constants/ActionTypes';
import { getAuthType } from '../../../models/AuthType';
import findIndex from 'lodash/array/findIndex';

const CHILDREN_DATA_FETCHED = '/sections/admin/Permissions/CHILDREN_DATA_FETCHED';

let defaultState = {
  permissions: false,
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
 * @returns {{type, permissions: *, receivedAt: number}}
 */
function receiveData(json) {
  return {
    type: ActionTypes.DATA_FETCHED,
    permissions: json,
    receivedAt: Date.now()
  };
}

/**
 * Fetches the permissions.
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
 * Query for removing role.
 *
 * @param key
 * @returns {*}
 */
function removeRoleApi(key) {
  return new QueryBuilder(`/api/v1/auth-type/${key}`)
    .remove();
}

/**
 * Fetches the promise for server side rendering.
 */
export function renderServer() {
  return fetchRolesApi().then(function(json) {
    return { permissions: json };
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
 * Action: Open role dialog.
 *
 * @returns {{type, showModal: boolean}}
 */
export function openRoleModal() {
  return {
    type: ActionTypes.OPEN_MODAL,
    showModal: true
  };
}

/**
 * Action: Close role dialog.
 *
 * @returns {{type, showModal: boolean}}
 */
export function closeRoleModal() {
  return {
    type: ActionTypes.CLOSE_MODAL,
    showModal: false
  };
}

/**
 * Action: Removes a role.
 *
 * @param key
 * @returns {Function}
 */
export function removeRole(key) {
  return dispatch => {
    return removeRoleApi(key)
      .then(() => dispatch(fetchRoles()));
  };
}

function receiveChildrenData(user_id, json) {
  return {
    type: CHILDREN_DATA_FETCHED,
    perm_id: user_id,
    childrenRows: json
  };
}

export function fetchChildren(key, toggle) {
  if (toggle === undefined) {
    return dispatch => {
      return new QueryBuilder(`/api/v1/auth-type-child`)
        .addParam('filters', [{name: 'parent', value: key}])
        .addParam('relations', [{name: 'authType'}])
        .fetch()
        .then(json => dispatch(receiveChildrenData(key, json)));
    }
  } else {
    return {
      type: CHILDREN_DATA_FETCHED,
      perm_id: key,
      showChildren: !toggle
    };
  }
}

export function submitForm(values, dispatch) {
  return new Promise((resolve, reject) => {

    try {
      const Role = getAuthType(Base);
      const roleInstance = new Role(values);
      roleInstance.save()
        .then(() => {
          dispatch(fetchRoles(1));
          resolve(true);
        })
        .catch((err) => {
          let errors = {};
          forOwn(err.errors, (value, key) => {
            errors[key] = value.message;
          });
          reject(errors);
        });
    }
    catch (e) {
      console.error(e);
    }
  });
}

/**
 * Roles Reducer
 *
 * @param {object} state The existing or default state.
 * @param {object} action The action specified.
 * @returns {object} The new state
 */
export default function(state = defaultState, action) {
  let permissionIndex;
  let permissions = state.permissions;

  switch (action.type) {
    case ActionTypes.DATA_FETCHED:
      return Object.assign({}, state, {
        permissions: action.permissions || false
      });
    case ActionTypes.OPEN_MODAL:
    case ActionTypes.CLOSE_MODAL:
      return Object.assign({}, state, {
        showModal: action.showModal
      });
    case CHILDREN_DATA_FETCHED:
      permissionIndex = findIndex(state.permissions.payload, (permission) => permission.id === action.perm_id);
      if (permissionIndex !== -1) {
        if (action.childrenRows) {
          permissions.payload[permissionIndex].childrenRows = action.childrenRows;
          permissions.payload[permissionIndex].showChildren = true;
        } else {
          permissions.payload[permissionIndex].showChildren = action.showChildren;
        }
      }
      return {
        permissions: permissions,
        time: Date.now() //Always triggers a re-render.
      };
    case ActionTypes.CLEAR_SERVER_DATA:
      return clearServerData('Permissions', state);
    case ActionTypes.INIT:
      return parseServerData('Permissions', state);
    default:
      return state;
  }
}

