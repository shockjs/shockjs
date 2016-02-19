import { getServerModel } from "../config/index";
import { getAuthTypeChild } from '../../shared/models/AuthTypeChild';
import merge from 'lodash/object/merge';
import AuthType from '../models/AuthType';

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


