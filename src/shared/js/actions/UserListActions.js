import {fetch} from '../utils/isomorphic'
import {DATA_REQUESTED, DATA_FETCHED, DATA_SUCCEEDED, DATA_FAILED} from '../constants/ActionTypes';

function requestData() {
  return {
    type: DATA_REQUESTED
  }
}

function receiveData(json) {
  return {
    type: DATA_FETCHED,
    posts: json,
    receivedAt: Date.now()
  }
}

function fetchAllUsers() {
  return fetch(`/api/v1/users`)
    .then(req => req.json());
}

export function renderServer() {
  return fetchAllUsers().then(function(json) {
    return {posts: json};
  });
}

export function fetchPosts() {
  return dispatch => {
    dispatch(requestData());
    return fetchAllUsers()
      .then(json => dispatch(receiveData(json)))
  }
}
