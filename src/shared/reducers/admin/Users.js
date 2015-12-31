import * as ActionTypes from '../../constants/ActionTypes';
import { parseServerData } from '../../utils/isomorphic';

let defaultState = {
  users: false,
  renderedServer: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case "@@INIT":
      return parseServerData('Users', state);
      break;
    case ActionTypes.DATA_FETCHED:
      return Object.assign({}, state, {
        users: action.users || []
      });
      break;
    default:
      return state;
  }
}

