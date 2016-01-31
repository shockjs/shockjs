import { getBase } from './Base';

export function getAuthAssignment(Base) {

  class AuthAssignment extends getBase(Base)
  {

    constructor(attributes)
    {
      super(attributes, '/api/v1/auth-assignment');
    }

    get rules()
    {

    }
  }

  return AuthAssignment;
}
