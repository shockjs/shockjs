import { getBase } from './Base';

export function getContact(Base) {

  class Contact extends getBase(Base)
  {
    get rules()
    {
      return {
        name: [
          {
            rule: 'required',
            message: 'Name cannot be blank'
          }
        ],
        phone: [
          {
            rule: 'required',
            message: 'Phone cannot be blank'
          }
        ],
        email: [
          {
            rule: 'required',
            message: 'Email cannot be blank'
          },
          'email'
        ],
        comments: [
          {
            rule: 'required',
            message: 'Comments cannot be blank'
          }
        ],
        captcha: [
          {
            rule: 'required',
            message: 'Captcha must be checked'
          }
        ]
      };
    }
  }

  return Contact;
}
