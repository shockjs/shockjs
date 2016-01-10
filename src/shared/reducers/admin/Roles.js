import * as ActionTypes from '../../constants/ActionTypes';
import { parseServerData, clearServerData } from '../../utils/IsoBridge';

let defaultState = {
  roles: false,
  renderedServer: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
  case ActionTypes.DATA_FETCHED:
    return Object.assign({}, state, {
      roles: action.roles || false
    });
  default:
    return parseServerData('Roles', state);
  }
}

