import * as ActionTypes from '../constants/ActionTypes';
import { parseServerData } from '../utils/isomorphic';

let defaultState = {

};

export default function(state = defaultState, action) {
  switch (action.type) {
  case ActionTypes.DATA_REQUESTED:
    return Object.assign({}, state, {
      submitted: true
    });
  case ActionTypes.DATA_FETCHED:
    return Object.assign({}, state, {
      completed: true
    });
  default:
    return parseServerData('Login', state);
  }
}
