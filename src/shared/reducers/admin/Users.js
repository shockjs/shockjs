import * as ActionTypes from '../../constants/ActionTypes';
import { parseServerData, clearServerData } from '../../utils/IsoBridge';

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
  case ActionTypes.OPEN_MODAL:
  case ActionTypes.CLOSE_MODAL:
    return Object.assign({}, state, {
      showModal: action.showModal
    });
  case ActionTypes.CLEAR_SERVER_DATA:
    return clearServerData('Users', state);
  case '@INIT':
    console.log('default', state, action);
    return parseServerData('Users', state);
  default:
    return state;
  }
}

