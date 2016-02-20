import { getBase } from './base.model';

export function getContact(BaseModel) {

  class ContactModel extends getBase(BaseModel)
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

  return ContactModel;
}
