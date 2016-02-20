import { getServerModel } from "../config/config";
import { getAuthAssignment } from '../../shared/models/auth.assignment.model';
import merge from 'lodash/object/merge';
import AuthType from './auth.type.model';

/**
 * User Model
 */

let BaseUser = getAuthAssignment(getServerModel());

class AuthAssignment extends BaseUser
{

  static allowedRelations()
  {
    return [
      'authType'
    ];
  }

  get tableName()
  {
    return 'tbl_authAssignment';
  }

  get rules()
  {
    return merge(super.rules, {});
  }

  authType()
  {
    return this.belongsTo(AuthType, 'authTypeID');
  }

}

export default AuthAssignment;


