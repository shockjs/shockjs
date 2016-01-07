"use strict";

import { fetch, redirect } from '../utils/IsoBridge';
import { DATA_REQUESTED, DATA_FETCHED } from '../constants/ActionTypes';
import Base from '../../client/models/Base';
import { getAuth } from '../models/Auth';
import forOwn from 'lodash/object/forOwn';
import { fetchAuth } from './AppActions';

function requestData() {
  return {
    type: DATA_REQUESTED
  };
}

function receiveData(data) {
  return {
    type: DATA_FETCHED,
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
    fetch(`/api/v1/auth/login`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then((req) => {
        switch (req.status) {
          case 200:
            req.json().then((data) => {
              resolve(data);
            });
            break;
          default:
            req.json().then((data) => {
              reject({status: req.status, results: data});
            });
        }
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