import authApi from './authApi';
import userApi from './userApi';
import emailApi from './emailApi';
import authTypeApi from './authTypeApi';
import authAssignmentApi from './authAssignmentApi';

export default authApi.concat(
    userApi,
    emailApi,
    authTypeApi,
    authAssignmentApi
);
