import { getBase } from './Base';

export function getAuthType(Base) {

  class AuthType extends getBase(Base)
  {

    constructor(attributes)
    {
      super(attributes, '/api/v1/auth-type');
    }

    get rules()
    {
      return {
        name: ['required'],
        description: ['required']
      };
    }
  }

  return AuthType;
}
