import * as ActionTypes from '../../constants/ActionTypes';
import { parseServerData } from '../../utils/isomorphic';

let defaultState = {
  renderedServer: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case "@@INIT":
      return parseServerData('Dashboard', state);
      break;
    default:
      return state;
  }
}