"use strict";

import RestApi from '../../classes/RestApi';
import AuthType from '../../models/AuthTypeChild';

class AuthTypeChildApi extends RestApi
{
  constructor()
  {
    super('auth-type-child', AuthType);
  }

  get endPoints()
  {
    let endPoints = super.endPoints;
    // Push extra endpoint here or delete them.
    return endPoints;
  }
}

export default new AuthTypeChildApi().endPoints;
