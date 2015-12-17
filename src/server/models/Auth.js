import { getAuth } from '../../shared/js/models/Auth';
import merge from 'lodash/object/merge';

/**
 * Login Model
 */
module.exports = function (bookshelf) {

  let BaseAuth = getAuth();

  class Auth extends BaseAuth
  {
    constructor()
    {
      super();
    }

    get rules()
    {
      return merge(super.rules, {});
    }

  }

  return bookshelf.model('Auth', Auth);
};
