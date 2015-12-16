import authApi from './authApi';
import userApi from './userApi';

export default authApi.concat(
    userApi
);
