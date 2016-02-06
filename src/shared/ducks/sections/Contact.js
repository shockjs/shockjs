"use strict";

import { fetch, redirect, parseServerData, getConfig, isServer  } from '../../utils/IsoBridge';
import * as ActionTypes from '../../constants/ActionTypes';
import Base from '../../../client/models/Base';
import { getContact } from '../../models/Contact';
import forOwn from 'lodash/object/forOwn';
const config = getConfig();
import QueryBuilder from '../../classes/QueryBuilder';

let defaultState = {
  fieldData: {}
};

if (!isServer()) {
  defaultState.siteKey = config.recaptcha.siteKey;
}

/**
 * Set the captcha key.
 * @returns {{type, captcha: undefined}}
 */
export function setCaptchaKey(data) {
  console.log('[action] => setCaptchaKey: ', data);
  return {
    type: ActionTypes.CAPTCHA_KEY,
    captcha: data
  };
}

/**
 * Clear the captcha key.
 * @returns {{type, captcha: undefined}}
 */
export function clearCaptchaKey() {
  console.log('[action] => clearCaptchaKey');
  return {
    type: ActionTypes.CAPTCHA_KEY,
    captcha: undefined
  };
}

/**
 * Once the captcha is loaded.
 * @returns {{type, captcha: undefined}}
 */
export function captchaLoaded() {
  console.log('[action] => captchaLoaded');
  return {
    type: ActionTypes.CAPTCHA_KEY,
    captcha: undefined
  };
}

/**
 * Clears the submit status on the form.
 * @returns {{type}}
 */
export function clearSubmitted() {
  return {
    type: ActionTypes.CLEAR_SUBMIT
  };
}

/**
 * This is the action that is submitted through the form.
 * @param values
 * @param dispatch
 * @returns {Promise}
 */
export function submitForm(values, dispatch) {
  return new Promise((resolve, reject) => {
    const Contact = getContact(Base);
    const contactInstance = new Contact(values);
    contactInstance.validate()
      .then(() => {
        new QueryBuilder(`/api/v1/email/contact`)
          .addHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          })
          .addParams(values)
          .setMethod('POST')
          .execute()
          .then((data) => {
            switch (data.success) {
              case true:
                dispatch({
                  type: ActionTypes.SUBMIT_FORM_SUCCESS
                });
                break;
              case false:
                dispatch({
                  type: ActionTypes.SUBMIT_FORM_FAILURE
                });
                break;
            }
            resolve(true);
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
 * Contact Reducer
 *
 * @param {object} state The existing or default state.
 * @param {object} action The action specified.
 * @returns {object} The new state
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.SUBMIT_FORM_SUCCESS:
      return {
        submitted: true
      };
    case ActionTypes.SUBMIT_FORM_FAILURE:
      return state;
    case ActionTypes.CAPTCHA_KEY:
      let newState = Object.assign({}, state, {
        fieldData: {
          captcha: action.captcha
        }
      });
      console.log(`[reducer] => ${ActionTypes.CAPTCHA_KEY}: `, newState);
      return newState;
    case ActionTypes.CLEAR_SUBMIT:
      let clearSubmit = Object.assign({}, state, {
        submitted: false
      });
      console.log(`[reducer] => ${ActionTypes.CLEAR_SUBMIT}: `, clearSubmit);
      return clearSubmit;

    default:
      return parseServerData('Contact', state);
  }
}
