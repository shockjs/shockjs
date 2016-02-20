"use strict";

import RestApiClass from '../../classes/rest.api.class';
import AuthType from '../../models/auth.type.model';

class AuthTypeApi extends RestApiClass
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
