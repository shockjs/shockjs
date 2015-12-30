"use strict";

import { fetch } from '../utils/isomorphic'
import { DATA_REQUESTED, DATA_FETCHED, DATA_SUCCEEDED, DATA_FAILED } from '../constants/ActionTypes';

function requestData() {
  return {
    type: DATA_REQUESTED
  }
}

function receiveData(json) {
  return {
    type: DATA_FETCHED,
    users: json,
    receivedAt: Date.now()
  }
}

function fetchUsersApi() {
  return fetch(`/api/v1/users`)
    .then(req => req.json());
}

function updateUserApi(key, value) {
  return fetch(`/api/v1/users/${key}`, {
    method: 'put',
    body: JSON.stringify({
      active: value
    })
  })
    .then(req => req.json());
}

export function renderServer() {
  return fetchUsersApi().then(function(json) {
    return { users: json };
  });
}

export function fetchUsers() {
  return dispatch => {
    dispatch(requestData());
    return fetchUsersApi()
      .then(json => dispatch(receiveData(json)))
  }
}

export function updateUser(key, value) {
  return dispatch => {
    return updateUserApi(key, value)
      .then(json => dispatch(fetchUsers()))
  }
}
