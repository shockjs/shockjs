"use strict";

import RestApiClass from '../../classes/rest.api.class';
import AuthType from '../../models/auth.type.child.model';

class AuthTypeChildApi extends RestApiClass
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
