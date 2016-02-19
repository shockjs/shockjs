import { getServerModel } from "../config/index";
import { getAuthType } from '../../shared/models/AuthType';
import merge from 'lodash/object/merge';
import AuthAssignment from '../models/AuthAssignment';
import AuthTypeChild from '../models/AuthTypeChild';

/**
 * User Model
 */

let BaseUser = getAuthType(getServerModel());

class AuthType extends BaseUser
{
  get tableName()
  {
    return 'tbl_authType';
  }

  authAssignment()
  {
    return this.belongsTo(AuthAssignment, 'name');
  }

  authTypeChildren()
  {
    return this.hasMany(AuthTypeChild, 'id');
  }

  get rules()
  {
    return merge(super.rules, {});
  }

}

export default AuthType;


