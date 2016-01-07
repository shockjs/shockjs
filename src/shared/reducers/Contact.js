import { CAPTCHA_KEY } from '../constants/ActionTypes';
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
  case CAPTCHA_KEY:
    var newState = Object.assign({}, state, {
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
