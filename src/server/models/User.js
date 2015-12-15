/**
 * User Model
 */
module.exports = function (bookshelf) {

  var tableName = 'tbl_user';

  var User = bookshelf.Model.extend({
    tableName: tableName
  });

  return bookshelf.model('User', User);
};
