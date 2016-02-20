import { getBase } from './base.model';

export function getAuthAssignment(Base) {

  class AuthAssignmentModel extends getBase(Base)
  {

    constructor(attributes)
    {
      super(attributes, '/api/v1/auth-assignment');
    }

    get rules()
    {
      return {
        authTypeID: 'required',
        userID: 'required'
      };
    }
  }

  return AuthAssignmentModel;
}
