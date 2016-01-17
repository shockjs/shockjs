"use strict";

import { fetch } from '../utils/IsoBridge';
import Base from '../../client/models/Base';
import { getUser } from '../models/User';
import forOwn from 'lodash/object/forOwn';
import { DATA_REQUESTED, DATA_FETCHED, CLEAR_SERVER_DATA, OPEN_MODAL, CLOSE_MODAL } from '../constants/ActionTypes';

function requestData() {
  return {
    type: DATA_REQUESTED
  };
}

function receiveData(json) {
  return {
    type: DATA_FETCHED,
    users: json,
    receivedAt: Date.now()
  };
}

function fetchUsersApi(page=1) {
  return fetch(`/api/v1/users?page=${page}`)
    .then((req) => {
      return new Promise((resolve) => {
        req.json().then((data) => {
          resolve({
            meta: {
              totalCount: req.headers.get("X-Pagination-Total-Count"),
              perPage: req.headers.get("X-Pagination-Per-Page"),
              currentPage: req.headers.get("X-Pagination-Current-Page")
            },
            payload: data
          });
        });
      });
    });
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

export function cleanupServer() {
  return {
    type: CLEAR_SERVER_DATA
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
    type: OPEN_MODAL,
    showModal: true
  };
}

export function closeUserModal() {
  return {
    type: CLOSE_MODAL,
    showModal: false
  };
}

export function submitForm(values, dispatch) {
  console.log('test');
  return new Promise((resolve, reject) => {
    console.log('test1');
    const User = getUser(Base);
    const userInstance = new User(values);
    console.log(userInstance);
    userInstance.validate()
      .then(() => {
        console.warn('true');
        resolve(true);
      })
      .catch((err) => {
        console.error(err);
        let errors = {};
        forOwn(err.errors, (value, key) => {
          errors[key] = value.message;
        });
        reject(errors);
      });
  });
}