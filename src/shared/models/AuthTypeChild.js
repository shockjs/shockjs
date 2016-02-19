import { getBase } from './Base';

export function getAuthTypeChild(Base=function(){}) {

  class AuthTypeChild extends getBase(Base)
  {

    constructor(attributes)
    {
      super(attributes, '/api/v1/auth-type-child');
    }

    get rules()
    {
      return {};
    }
  }


  return AuthTypeChild;
}
