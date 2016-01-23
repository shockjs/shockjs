"use strict";

import { fetch, parseServerData, clearServerData } from '../utils/IsoBridge';
import Base from '../../client/models/Base';
import { getUser } from '../models/User';
import forOwn from 'lodash/object/forOwn';
import QueryBuilder from '../classes/QueryBuilder';
import * as ActionTypes from '../constants/ActionTypes';

let defaultState = {
  users: false,
  renderedServer: false
};

function requestData() {
  return {
    type: ActionTypes.DATA_REQUESTED
  };
}

function receiveData(json) {
  return {
    type: ActionTypes.DATA_FETCHED,
    users: json,
    receivedAt: Date.now()
  };
}

function fetchUsersApi(page=1) {
  return new QueryBuilder(`/api/v1/users`)
    .addParam('page', page)
    .addParam('per-page', 5)
    .fetchList();
}

function updateUserApi(key, value) {
  return new QueryBuilder(`/api/v1/users/${key}`)
    .addParam('active', value)
    .update();
}

function removeUserApi(key) {
  return new QueryBuilder(`/api/v1/users/${key}`)
    .remove();
}

export function renderServer() {
  return fetchUsersApi().then(function(json) {
    return { users: json };
  });
}

export function cleanupServer() {
  return {
    type: ActionTypes.CLEAR_SERVER_DATA
  };
}

export function fetchUsers(page) {
  return dispatch => {
    dispatch(requestData());
    return fetchUsersApi(page)
      .then(json => dispatch(receiveData(json)));
  };
}

export function updateUser(key, value) {
  return dispatch => {
    return updateUserApi(key, value)
      .then(() => dispatch(fetchUsers()));
  };
}

export function openUserModal() {
  return {
    type: ActionTypes.OPEN_MODAL,
    showModal: true
  };
}

export function closeUserModal() {
  return {
    type: ActionTypes.CLOSE_MODAL,
    showModal: false
  };
}

export function removeUser(key) {
  return dispatch => {
    return removeUserApi(key)
      .then(() => dispatch(fetchUsers()));
  };
}

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

export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.DATA_FETCHED:
      return Object.assign({}, state, {
        users: action.users || false,
        showModal: false
      });
    case ActionTypes.OPEN_MODAL:
    case ActionTypes.CLOSE_MODAL:
      return Object.assign({}, state, {
        showModal: action.showModal
      });
    case ActionTypes.CLEAR_SERVER_DATA:
      return clearServerData('Users', state);
    case '@INIT':
      console.log('default', state, action);
      return parseServerData('Users', state);
    default:
      return state;
  }
}