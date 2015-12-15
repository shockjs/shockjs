import * as ActionTypes from '../constants/ActionTypes';
import { parseServerData } from '../utils/isomorphic';

let defaultState = {
  users: [],
  renderedServer: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.DATA_FETCHED:
        console.log(action);
      return Object.assign({}, state, {
        users: action.users
      });
      break;
    case "@@INIT":
      return parseServerData('Welcome', state);
      break;
    default:
      return state;
  }
}

