import { getAuth } from '../../shared/models/Auth';
import User from './User';
import { getServerModel } from "../config/index";
import Checkit from "checkit";
import merge from 'lodash/object/merge';
import pick from 'lodash/object/pick';
import Boom from 'boom';
import bcrypt from 'bcrypt';

/**
 * Login Model
 */
let BaseAuth = getAuth(getServerModel());

class Auth extends BaseAuth
{

  constructor(attributes)
  {
    super(attributes);
    this.attributes = attributes;
  }

  /**
   * login the user in.
   * @returns {Promise}
     */
  login()
  {
    return new Promise((resolve, reject) => {
      this.validate()
      .then(() => {
        let user = new User();
        user.query({
          where: {
            username: this.attributes.username,
            active: 1
          }
        })
        .fetch({required: true})
        .then((data) => {
          if (data === null) {
            reject(Boom.badData('Invalid credentials.'));
          } else {

            bcrypt.compare(this.attributes.password, data.attributes.password, (err, res) => {

              if (err) {
                reject(Boom.badData(err));
                return;
              }

              if (res === true) {
                resolve(pick(data.attributes, Object.keys(data.attributes).filter(User.filterAttribute)));
              }
              else {
                reject(Boom.badData('Invalid credentials.'));
              }
            });
          }
        })
        .catch((error) => {
          reject(Boom.badData(error));
        });
      })
      .caught(Checkit.Error, (err) => {
        reject(Boom.badData(err));
      });
    });
  }

  get rules()
  {
    return merge(super.rules, {});
  }
}

export default Auth;
