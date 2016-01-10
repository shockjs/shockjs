import authApi from './authApi';
import userApi from './userApi';
import emailApi from './emailApi';
import roleApi from './authTypeApi';

export default authApi.concat(
    userApi,
    emailApi,
    roleApi
);
