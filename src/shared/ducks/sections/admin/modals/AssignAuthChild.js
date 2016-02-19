"use strict";

import * as ActionTypes from '../../../../constants/ActionTypes';
import QueryBuilder from '../../../../classes/QueryBuilder';
import Base from '../../../../../client/models/Base';
import forOwn from 'lodash/object/forOwn';
import { getAuthAssignment } from '../../../../models/AuthAssignment';
import { fetchUsers } from '../../../../ducks/sections/admin/Users';
const AuthAssignment = getAuthAssignment(Base);

const FETCH_AUTH_TYPES = 'sections/admin/modals/AssignAuthChild/FETCH_AUTH_TYPES';
const defaultState = {};

export function fetchPermissionTypes(id)
{
  return dispatch => {
    return new QueryBuilder(`/api/v1/auth-type`)
      .addParam('filters', [{
        name: 'type',
        value: id
      }])
      .fetch()
      .then((data) => {
        dispatch({
          type: FETCH_AUTH_TYPES,
          authTypes: data
        });
      });
  };
}

export function submitForm(values, dispatch) {
  return new Promise((resolve, reject) => {
    const authInstance = new AuthAssignment(values);
    authInstance.save()
      .then(() => {
        dispatch(fetchUsers(1));
        resolve(true);
      })
      .catch((err) => {
        let errors = {};
        forOwn(err.errors, (value, key) => {
          errors[key] = value.message;
        });
        reject(errors);
      });
  });
}

export default function(state=defaultState, action) {
  switch(action.type) {
    case FETCH_AUTH_TYPES:
      return Object.assign({}, state, {
        authTypes: action.authTypes
      });
    case ActionTypes.OPEN_PERMISSIONS_MODAL:
      return defaultState; // reset modal to default.
    case ActionTypes.CLOSE_PERMISSIONS_MODAL:
      return defaultState;
    default:
      return state;
  }
}