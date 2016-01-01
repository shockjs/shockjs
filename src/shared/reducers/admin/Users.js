import * as ActionTypes from '../../constants/ActionTypes';
import { parseServerData, clearServerData } from '../../utils/isomorphic';

let defaultState = {
  users: false,
  renderedServer: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.DATA_FETCHED:
      return Object.assign({}, state, {
        users: action.users || false
      });
      break;
    case ActionTypes.CLEAR_SERVER_DATA:
      return clearServerData('Users', state);
      break;
    default:
      return parseServerData('Users', state);
      break;
  }
}

