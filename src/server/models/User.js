import { getServerModel } from "../config/index";
import { getUser } from '../../shared/models/User';
import merge from 'lodash/object/merge';

/**
 * User Model
 */

let BaseUser = getUser(getServerModel());

class User extends BaseUser
{

  constructor(attributes)
  {
    super(attributes);
    this._confirmPassword = '';
  }

  get virtuals()
  {
    return {
      confirmPassword: {
        get: function () {
          return this._confirmPassword;
        },
        set: function(value) {
          this._confirmPassword = value;
        }
      }
    };
  }

  get rules()
  {
    return merge(super.rules, {});
  }

  static filterAttribute(attribute)
  {
    return [ "password", "salt" ].indexOf(attribute) === -1;
  }

}

User.tableName = 'tbl_user';

export default User;


