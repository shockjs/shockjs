import { getBase } from './base.model';

export function getAuth(Base) {

  class AuthModel extends getBase(Base)
  {

    get rules()
    {
      return {
        username: ['required'],
        password: ['required']
      };
    }
  }

  return AuthModel;
}
