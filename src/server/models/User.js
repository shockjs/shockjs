import { getUser } from '../../shared/js/models/User';
import merge from 'lodash/object/merge';

/**
 * User Model
 */
module.exports = function (bookshelf) {

  let BaseUser = getUser(bookshelf.Model);

  class User extends BaseUser
  {
    constructor()
    {
      super();
      this._tableName = 'tbl_user';
    }

    get tableName()
    {
      return this._tableName;
    }

    get rules()
    {
      return merge(super.rules, {});
    }

  }

  return bookshelf.model('User', User);
};
