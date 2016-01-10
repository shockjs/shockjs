import { getBase } from './Base';

export function getAuthType(Base) {

  class AuthType extends getBase(Base)
  {
    get rules()
    {
      return {

      };
    }
  }

  return AuthType;
}
