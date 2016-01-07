"use strict";

import { fetch, redirect } from '../utils/IsoBridge';
import { DATA_REQUESTED, DATA_FETCHED, CAPTCHA_KEY } from '../constants/ActionTypes';


export function setCaptchaKey(data) {
  console.log('[action] => setCaptchaKey: ', data);
  return {
    type: CAPTCHA_KEY,
    captcha: data
  };
}

export function clearCaptchaKey() {
  console.log('[action] => clearCaptchaKey');
  return {
    type: CAPTCHA_KEY,
    captcha: undefined
  };
}

export function captchaLoaded() {
  console.log('[action] => captchaLoaded');
  return {
    type: CAPTCHA_KEY,
    captcha: undefined
  };
}

/**
 * This is the action that is submitted through the form.
 * @param values
 * @param dispatch
 * @returns {Promise}
 */
export function submitForm(values, dispatch) {
  console.log(values);
  return new Promise((resolve, reject) => {

  });
}