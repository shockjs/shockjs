import { getBase } from './Base';

export function getUser(Base) {

  class User extends getBase(Base)
  {
    get rules()
    {
      return {
        username: [
          {
            rule: 'required',
            message: 'Username cannot be blank'
          }
        ],
        firstName: [
          {
            rule: 'required',
            message: 'First name cannot be blank'
          }
        ],
        lastName: [
          {
            rule: 'required',
            message: 'Last name cannot be blank'
          }
        ],
        password: [
          {
            rule: 'required',
            message: 'Password cannot be blank'
          }
        ],
        confirmPassword: [
          {
            rule: 'required',
            message: 'Confirm password cannot be blank'
          }
        ],
        email: [
          {
            rule: 'required',
            message: 'Email cannot be blank'
          },
          'email'
        ]
      };
    }
  }

  return User;
}
