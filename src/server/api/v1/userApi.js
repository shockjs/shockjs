"use strict";

import RestApi from '../../classes/RestApi';
import User from '../../models/User';

class UserApi extends RestApi
{
  constructor()
  {
    super('users', User);
  }

  get endPoints()
  {
    let endPoints = super.endPoints;
    // Push extra endpoint here or delete them.
    return endPoints;
  }
}

export default new UserApi().endPoints;
