"use strict";

import { fetch, redirect, parseServerData } from '../utils/IsoBridge';
import * as ActionTypes from '../constants/ActionTypes';
import Base from '../../client/models/Base';
import { getAuth } from '../models/Auth';
import forOwn from 'lodash/object/forOwn';
import { fetchAuth } from './App';
import QueryBuilder from '../classes/QueryBuilder';

let defaultState = {

};

function requestData() {
  return {
    type: ActionTypes.DATA_REQUESTED
  };
}

function receiveData(data) {
  return {
    type: ActionTypes.DATA_FETCHED,
    ...data
  };
}

/**
 * This is the main login submission.
 * @param form
 * @returns {*}
 */
function loginUser(form) {
  return new Promise((resolve, reject) => {
    new QueryBuilder(`/api/v1/auth/login`)
      .addParams(form)
      .addHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
      .setMethod('POST')
      .execute(false)
      .then((req) => {
        req.json()
          .then((data) => {
            switch (req.status) {
              case 200:
                resolve(data);
                break;
              default:
                reject({status: req.status, results: data});
            }
          });
      });
  });
}

/**
 * This is the action that is submitted through the form.
 * @param values
 * @param dispatch
 * @returns {Promise}
 */
export function submitForm(values, dispatch) {
  return new Promise((resolve, reject) => {
    const Auth = getAuth(Base);
    const authInstance = new Auth(values);
    authInstance.validate()
      .then(() => {
        dispatch(requestData());
        return loginUser(values)
          .then(() => {
            return dispatch(fetchAuth());
          })
          .then(() => {
            redirect('/');
            resolve();
          })
          .catch(function(err) {
            reject({ "_error": [err.results.message] });
          });
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

/**
 * Login Reducer
 *
 * @param {object} state The existing or default state.
 * @param {object} action The action specified.
 * @returns {object} The new state
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.DATA_REQUESTED:
      return Object.assign({}, state, {
        submitted: true
      });
    case ActionTypes.DATA_FETCHED:
      return Object.assign({}, state, {
        completed: true
      });
    default:
      return parseServerData('Login', state);
  }
}
