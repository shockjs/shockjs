import { CAPTCHA_KEY, SUBMIT_FORM_FAILURE, SUBMIT_FORM_SUCCESS } from '../constants/ActionTypes';
import { parseServerData, getConfig, isServer } from '../utils/IsoBridge';
const config = getConfig();

let defaultState = {
  fieldData: {}
};

if (!isServer()) {
  defaultState.siteKey = config.recaptcha.siteKey;
}

export default function(state = defaultState, action) {
  switch (action.type) {
  case SUBMIT_FORM_SUCCESS:
    let successState = Object.assign({}, state, {

    });
    console.log(`[reducer] => ${CAPTCHA_KEY}: `, successState);
    return successState;
  case SUBMIT_FORM_FAILURE:
    return state;
  case CAPTCHA_KEY:
    let newState = Object.assign({}, state, {
      fieldData: {
        captcha: action.captcha
      }
    });
    console.log(`[reducer] => ${CAPTCHA_KEY}: `, newState);
    return newState;
  default:
    return parseServerData('Contact', state);
  }
}
