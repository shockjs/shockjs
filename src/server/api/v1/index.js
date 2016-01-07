import authApi from './authApi';
import userApi from './userApi';
import emailApi from './emailApi';

export default authApi.concat(
    userApi,
    emailApi
);
