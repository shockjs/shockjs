import { getBase } from './base.model';

export function getAuthTypeChild(BaseModel=function(){}) {

  class AuthTypeChildModel extends getBase(BaseModel)
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


  return AuthTypeChildModel;
}
