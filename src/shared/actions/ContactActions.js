"use strict";

import { fetch, redirect } from '../utils/IsoBridge';
import { CAPTCHA_KEY, SUBMIT_FORM_SUCCESS, SUBMIT_FORM_FAILURE, CLEAR_SUBMIT } from '../constants/ActionTypes';
import Base from '../../client/models/Base';
import { getContact } from '../models/Contact';
import forOwn from 'lodash/object/forOwn';

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

export function clearSubmitted() {
  return {
    type: CLEAR_SUBMIT
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
        fetch(`/api/v1/email/contact`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
          .then(resp => resp.json())
          .then((data) => {
            switch (data.success) {
              case true:
                dispatch({
                  type: SUBMIT_FORM_SUCCESS
                });
                break;
              case false:
                dispatch({
                  type: SUBMIT_FORM_FAILURE
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