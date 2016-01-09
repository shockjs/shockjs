import { getBase } from './Base';

export function getContact(Base) {

  class Contact extends getBase(Base)
  {
    get rules()
    {
      return {
        name: ['required'],
        phone: ['required'],
        email: ['required', 'email'],
        comments: ['required'],
        captcha: ['required']
      };
    }
  }

  return Contact;
}
