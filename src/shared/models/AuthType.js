import { getBase } from './Base';

export function getAuthType(Base) {

  class AuthType extends getBase(Base)
  {

    get idAttribute()
    {
      return 'name';
    }

    get rules()
    {
      return {

      };
    }
  }

  return AuthType;
}
