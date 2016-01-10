"use strict";

import RestApi from '../../classes/RestApi';
import AuthType from '../../models/AuthType';

class AuthTypeApi extends RestApi
{
  constructor()
  {
    super('auth-type', AuthType);
  }

  get endPoints()
  {
    let endPoints = super.endPoints;
    // Push extra endpoint here or delete them.
    return endPoints;
  }
}

export default new AuthTypeApi().endPoints;
