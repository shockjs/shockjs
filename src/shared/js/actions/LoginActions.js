import { fetch } from '../utils/isomorphic'
import { DATA_REQUESTED, DATA_FETCHED, DATA_SUCCEEDED, DATA_FAILED } from '../constants/ActionTypes';

function requestData() {
    return {
        type: DATA_REQUESTED
    }
}

function receiveData(data) {
    return {
        type: DATA_FETCHED
    }
}

/**
 * This is the main login submission and should not be run server side due to routing.
 * @param form
 * @returns {*}
 */
function loginUser(form) {
    const store = require('../../../client/js/store/configureStore');
    return fetch(`/api/v1/auth/login`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
    .then((req) => {
        switch (req.status) {
            case 200:
                store.browserHistory().replaceState(null, '/');
                return req.json();
                break;
            default:
                throw new Error(req);
                break;
        }
    });
}

export function submitForm(values, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch(requestData());
        return loginUser(values)
        .then(json => {
            console.log(json);
            dispatch(receiveData(json));
            resolve();
        })
        .catch(function(err) {
            reject(err);
        });
    });
}