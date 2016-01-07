import * as ActionTypes from '../constants/ActionTypes';
import { parseServerData } from '../utils/IsoBridge';

let defaultState = {

};

export default function(state = defaultState, action) {
  switch (action.type) {
  case "@@INIT":
    return parseServerData('App', state);
  case ActionTypes.UPDATE_AUTH:
    return Object.assign({}, state, action);
  default:
    return state;
  }
}

