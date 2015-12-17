import { getBase } from './Base';

export function getAuth(Base=getBase()) {

    class Auth extends Base
    {
        constructor()
        {
            super();
            this.username = '';
            this.password  = '';
        }

        get attributes()
        {
            return {
                username: this.username,
                password: this.password
            };
        }

        set attributes({ username='', password='' })
        {
            this.username = username;
            this.password = password;
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
