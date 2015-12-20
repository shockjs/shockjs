import { getBase } from './Base';

export function getAuth(Base) {

    class Auth extends getBase(Base)
    {
        constructor(attributes)
        {
            super(attributes);
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
