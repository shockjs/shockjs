"use strict";

import { fetch, parseServerData, clearServerData } from '../../../utils/iso.bridge';
import Base from '../../../../client/models/base.model';
import QueryBuilder from '../../../classes/query.builder';
import forOwn from 'lodash/object/forOwn';
import * as ActionTypes from '../../../constants/action.types.constants.js';
import { getAuthType } from '../../../models/auth.type.model';
import findIndex from 'lodash/array/findIndex';

const CHILDREN_DATA_FETCHED = '/sections/admin/Permissions/CHILDREN_DATA_FETCHED';
const OPEN_PERMISSION_CHILD_MODAL = '/sections/admin/Permissions/OPEN_PERMISSION_CHILD_MODAL';
const CLOSE_PERMISSION_CHILD_MODAL = '/sections/admin/Permissions/CLOSE_PERMISSION_CHILD_MODAL';

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

export function openPermissionChildModal(id) {
  return {
    type: OPEN_PERMISSION_CHILD_MODAL,
    isPermissionsChildModalShown: true,
    childID: id
  };
}

export function closePermissionChildModal(id) {
  return {
    type: CLOSE_PERMISSION_CHILD_MODAL,
    isPermissionsChildModalShown: false,
    childID: id
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

/**
 * Action: When child permission data is returned from the server.
 *
 * @param user_id
 * @param json
 * @returns {{type: string, perm_id: *, childrenRows: *}}
 */
function receiveChildrenData(user_id, json) {
  return {
    type: CHILDREN_DATA_FETCHED,
    perm_id: user_id,
    childrenRows: json
  };
}

/**
 * Action: Fetches all child permissions for a permission.
 *
 * @param key
 * @param toggle
 * @returns {*}
 */
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

/**
 * When a new role is submitted for creation using the permission add modal.
 *
 * @param values
 * @param dispatch
 * @returns {Promise}
 */
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
    /*
     * When data is initialized from client routing.
     */
    case ActionTypes.DATA_FETCHED:
      return Object.assign({}, state, {
        permissions: action.permissions || false
      });
    /*
     * When default modal is opened.
     */
    case ActionTypes.OPEN_MODAL:
    case ActionTypes.CLOSE_MODAL:
      return Object.assign({}, state, {
        showModal: action.showModal
      });
    /*
     * When a row is selected to add a permission.
     */
    case OPEN_PERMISSION_CHILD_MODAL:
    case CLOSE_PERMISSION_CHILD_MODAL:
      permissionIndex = findIndex(state.permissions.payload, (user) => user.id === action.childID);
      if (permissionIndex !== -1) {
        permissions.payload[permissionIndex].isPermissionsChildModalShown = action.isPermissionsChildModalShown != undefined
          ? action.isPermissionsChildModalShown
          : state.isPermissionsChildModalShown;
      }
      return {
        permissions: permissions,
        time: Date.now() //Always triggers a re-render.
      };
    /*
     * When a permission row is expanded.
     */
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
    /*
     * When the server data is cleared (change route on client)
     */
    case ActionTypes.CLEAR_SERVER_DATA:
      return clearServerData('Permissions', state);
    /*
     * Fetch the data that was rendered server-side.
     */
    case ActionTypes.INIT:
      return parseServerData('Permissions', state);
    /*
     * When nothing else applies.
     */
    default:
      return state;
  }
}

