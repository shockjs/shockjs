import { fetch } from '../utils/isomorphic'
import { DATA_REQUESTED, DATA_FETCHED, DATA_SUCCEEDED, DATA_FAILED } from '../constants/ActionTypes';
import { browserHistory } from '../store/configureStore';
import Base from '../../client/models/Base';
import { getAuth } from '../models/Auth';
import forOwn from 'lodash/object/forOwn';

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
                let history = browserHistory();
                history && history.replaceState(null, '/');
                break;
            default:
                throw new Error(req);
                break;
        }
    });
}

export function submitForm(values, dispatch) {
    return new Promise((resolve, reject) => {
        const Auth = getAuth(Base);
        const authInstance = new Auth(values);
        authInstance.validate()
        .then(() => {
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
        })
        .catch((err) => {
            let errors = {"_error": []};
            forOwn(err.errors, (value, key) => {
                errors[key] = value.message;
                errors['_error'].push(value.message);
            });
            reject(errors);
        });

    });
}