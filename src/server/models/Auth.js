import { getAuth } from '../../shared/js/models/Auth';
import User from './User';
import { getServerModel } from "../config/index";
import Checkit from "checkit";
import merge from 'lodash/object/merge';
import Boom from 'boom';

/**
 * Login Model
 */
let BaseAuth = getAuth(getServerModel());

class Auth extends BaseAuth
{
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
            password: this.attributes.password
          }
        })
        .fetch({required: true})
        .then((data) => {
          if (data === null) {
            reject(Boom.badData('Invalid credentials.'));
          } else {
            resolve(data);
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
