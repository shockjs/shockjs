import { getServerModel } from "../config/index";
import { getAuthType } from '../../shared/models/AuthType';
import merge from 'lodash/object/merge';

/**
 * User Model
 */

let BaseUser = getAuthType(getServerModel());

class AuthType extends BaseUser
{
  get tableName()
  {
    return this.prefix + 'authType';
  }

  get rules()
  {
    return merge(super.rules, {});
  }

}

export default AuthType;


