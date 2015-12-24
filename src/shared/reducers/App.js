import * as ActionTypes from '../constants/ActionTypes';
import { parseServerData } from '../utils/isomorphic';

let defaultState = {

};

export default function(state = defaultState, action) {
    switch (action.type) {
        case "@@INIT":
            return parseServerData('App', state);
            break;
        case ActionTypes.UPDATE_AUTH:
            return {
                isAuthenticated: true
            };
            break;
        default:
            return state;
    }
}

