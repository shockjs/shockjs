import * as ActionTypes from '../../constants/action.types.constants.js';
import { parseServerData } from '../../utils/iso.bridge';

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

