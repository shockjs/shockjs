import * as ActionTypes from '../../constants/ActionTypes';
import { parseServerData } from '../../utils/IsoBridge';

let defaultState = {
  userCount: 0,
  roleCount: 0,
  renderedServer: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
  case ActionTypes.DATA_FETCHED:
    console.log(action);
    return Object.assign({}, state, {
      userCount: action.userCount || 0,
      roleCount: action.roleCount || 0
    });
  default:
    return parseServerData('Dashboard', state);
  }
}