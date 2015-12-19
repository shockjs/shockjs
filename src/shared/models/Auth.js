import { getBase } from './Base';

export function getAuth(Base) {

    class Auth extends getBase(Base)
    {
        constructor()
        {
            super();
        }

        get rules()
        {
            return {
                username: ['required'],
                password: ['required']
            };
        }
    }

    return Auth;
}
