"use strict";

import { fetch, redirect } from '../utils/IsoBridge';
import { DATA_FETCHED, DATA_REQUESTED, CLEAR_SERVER_DATA } from '../constants/ActionTypes';

function requestData() {
  return {
    type: DATA_REQUESTED
  };
}

function receiveData(json) {
  return {
    type: DATA_FETCHED,
    ...json,
    receivedAt: Date.now()
  };
}

export function renderServer() {
  return fetchCountsApi();
}

export function cleanupServer() {
  return {
    type: CLEAR_SERVER_DATA
  };
}

function fetchUserCountApi() {
  return fetch(`/api/v1/users/count`)
    .then((req) => {
      return new Promise((resolve) => {
        req.json().then((data) => {
          resolve(data);
        });
      });
    });
}

function fetchRoleCountApi() {
  return fetch(`/api/v1/auth-type/count?filters=[{"name": "type", "value": 1}]`)
    .then((req) => {
      return new Promise((resolve) => {
        req.json().then((data) => {
          resolve(data);
        });
      });
    });
}

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

export function fetchCounts() {
  return dispatch => {
    dispatch(requestData());
    return fetchCountsApi()
      .then(json => dispatch(receiveData(json)));
  };
}
