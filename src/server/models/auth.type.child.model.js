import { getServerModel } from "../config/config";
import { getAuthTypeChild } from '../../shared/models/auth.type.child.model.js';
import merge from 'lodash/object/merge';
import AuthType from './auth.type.model';

/**
 * User Model
 */

let BaseUser = getAuthTypeChild(getServerModel());

class AuthTypeChild extends BaseUser
{
  get tableName()
  {
    return 'tbl_authTypeChild';
  }

  static allowedRelations()
  {
    return [
      'authType'
    ];
  }

  authType()
  {
    return this.belongsTo(AuthType, 'child');
  }

  get rules()
  {
    return merge(super.rules, {});
  }

}

export default AuthTypeChild;


