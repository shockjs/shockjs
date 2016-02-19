import authApi from './authApi';
import userApi from './userApi';
import emailApi from './emailApi';
import authTypeApi from './authTypeApi';
import authAssignmentApi from './authAssignmentApi';
import authTypeChildApi from './authTypeChildApi';

export default authApi.concat(
    userApi,
    emailApi,
    authTypeApi,
    authAssignmentApi,
    authTypeChildApi
);
