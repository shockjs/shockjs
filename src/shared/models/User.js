import { getBase } from './Base';

export function getUser(Base) {

  class User extends getBase(Base)
  {
    get rules()
    {
      return {
        username: ['required'],
        firstName: ['required'],
        lastName: ['required'],
        password: ['required']
      };
    }
  }

  return User;
}
