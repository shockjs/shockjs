import { getServerModel } from "../config/config";
import { getUser } from '../../shared/models/user.model';
import merge from 'lodash/object/merge';
import bcrypt from "bcrypt";

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
    this.on('saving', function(model, attrs, options) {

      //If inserting then we generate a salt and a hash from the salt.
      if (options.method == 'insert') {
        return new Promise((resolve, reject) => {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(model.attributes.password, salt, (err, hash) => {
              model.attributes.salt = salt;
              model.attributes.password = hash;
              resolve(true);
            });
          });
        });

      } else {
        return true;
      }
    })
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


