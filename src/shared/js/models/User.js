import { getBase } from './Base';

export function getUser(Base=getBase()) {

    class User extends Base
    {
        constructor()
        {
            super();
        }

        get rules()
        {
            return {
                firstName: ['required'],
                lastName: ['required'],
                password: ['required']
            };
        }
    }

    return User;
}
