import { fetch } from '../utils/isomorphic'
import { UPDATE_AUTH } from '../constants/ActionTypes';
import { browserHistory } from '../store/configureStore';

export function updateAuth(auth) {
    return {
        type: UPDATE_AUTH,
        isAuthenticated: auth
    }
}

