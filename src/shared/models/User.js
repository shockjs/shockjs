import { getBase } from './Base';
import QueryBuilder from '../classes/QueryBuilder';

export function getUser(Base) {

  class User extends getBase(Base)
  {

    constructor(attributes)
    {
      super(attributes, '/api/v1/users');
    }

    get rules()
    {
      return {
        username: [
          {
            rule: 'required',
            message: 'Username cannot be blank'
          },
          {
            rule: (val) => {
              const builder = new QueryBuilder(`${this._endpoint}/unique-username`)
                .addParam('username', val)
                .setMethod('POST');
              if (!this.isNewRecord()) {
                builder.addParam('id', this.attributes[this.primaryKey()]);
              }
              return builder.execute()
                .then((result) => {
                  if (!result) {
                    throw new Error('The username is already in use.');
                  }
                });
            }
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
          },
          {
            rule: 'matchesField:password',
            message: 'Confirm password must match password'
          }
        ],
        email: [
          {
            rule: 'required',
            message: 'Email cannot be blank'
          },
          {
            rule: (val) => {
              const builder = new QueryBuilder(`${this._endpoint}/unique-email`)
                .addParam('email', val)
                .setMethod('POST');
              if (!this.isNewRecord()) {
                builder.addParam('id', this.attributes[this.primaryKey()]);
              }
              return builder.execute()
                .then((result) => {
                  if (!result) {
                    throw new Error('The email address is already in use.');
                  }
                });
            }
          },
          'email'
        ]
      };
    }
  }

  return User;
}
