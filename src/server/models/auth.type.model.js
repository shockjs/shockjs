import { getServerModel } from "../config/config";
import { getAuthType } from '../../shared/models/auth.type.model';
import merge from 'lodash/object/merge';
import AuthAssignment from './auth.assignment.model';
import AuthTypeChild from './auth.type.child.model';

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


