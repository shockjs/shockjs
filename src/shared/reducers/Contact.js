import * as ActionTypes from '../constants/ActionTypes';
import { parseServerData } from '../utils/isomorphic';

let defaultState = {

};

export default function(state = defaultState, action) {
  switch (action.type) {
    case "@@INIT":
      return parseServerData('Contact', state);
      break;
    default:
      return state;
  }
}
