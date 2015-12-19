import { getServerModel } from "../config/index";
import { getUser } from '../../shared/models/User';
import merge from 'lodash/object/merge';

/**
 * User Model
 */

let BaseUser = getUser(getServerModel());

class User extends BaseUser
{
  get rules()
  {
    return merge(super.rules, {});
  }

  static filterAttribute(attribute)
  {
    return ["password", "salt"].indexOf(attribute) === -1;
  }

}

export default User;


