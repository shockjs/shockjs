"use strict";

import { fetch } from '../utils/IsoBridge';
import { DATA_REQUESTED, DATA_FETCHED, CLEAR_SERVER_DATA } from '../constants/ActionTypes';

function requestData() {
  return {
    type: DATA_REQUESTED
  };
}

function receiveData(json) {
  return {
    type: DATA_FETCHED,
    roles: json,
    receivedAt: Date.now()
  };
}

function fetchRolesApi(page=1) {
  return fetch(`/api/v1/auth-type?page=${page}&filters=[{"name": "type", "value": 1}]`)
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

export function renderServer() {
  return fetchRolesApi().then(function(json) {
    return { roles: json };
  });
}

export function cleanupServer() {
  return {
    type: CLEAR_SERVER_DATA
  };
}

export function fetchRoles(page) {
  return dispatch => {
    dispatch(requestData());
    return fetchRolesApi(page)
      .then(json => dispatch(receiveData(json)));
  };
}
