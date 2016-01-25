import * as ActionTypes from '../constants/ActionTypes';
import { parseServerData } from '../utils/IsoBridge';

let defaultState = {
  users: [],
  renderedServer: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.DATA_FETCHED:
      return Object.assign({}, state, {
        users: action.users
      });
    default:
      return parseServerData('Welcome', state);
  }
}
