"use strict";

const RestApi = require('../../classes/RestApi');

class UserApi extends RestApi
{
  constructor()
  {
    super('users', 'User');
  }

  get endPoints()
  {
    let endPoints = super.endPoints;
    // Push extra endpoint here or delete them.
    return endPoints;
  }
}

module.exports = new UserApi().endPoints;
