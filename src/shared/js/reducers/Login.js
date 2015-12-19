import * as ActionTypes from '../constants/ActionTypes';

let defaultState = {
  authenticated: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.DATA_REQUESTED:
      return Object.assign({}, state, {
        submitted: true
      });
      break;
    case ActionTypes.DATA_FETCHED:
      return Object.assign({}, state, {
        authenticated: true
      });
      break;
    default:
      return state;
  }
}
