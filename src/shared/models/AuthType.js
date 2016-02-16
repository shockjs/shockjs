import { getBase } from './Base';

export function getAuthType(Base=function(){}) {

  class AuthType extends getBase(Base)
  {

    constructor(attributes)
    {
      super(attributes, '/api/v1/auth-type');
    }

    get rules()
    {
      return {
        label: ['required'],
        name: ['required'],
        description: ['required'],
        type: ['required']
      };
    }
  }

  AuthType.ROLE = 1;
  AuthType.OPERATION = 2;

  return AuthType;
}
