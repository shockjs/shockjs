import { getBase } from './Base';

export function getAuth(Base) {

  class Auth extends getBase(Base)
  {
    constructor(attributes)
    {
      super(attributes, '/api/v1/auth-type');
    }

    primaryKey()
    {
      return 'name';
    }

    get rules()
    {
      return {
        name: ['required'],
        description: ['required']
      };
    }
  }

  return Auth;
}
