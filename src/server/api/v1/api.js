import authApi from './auth.api';
import userApi from './user.api';
import emailApi from './email.api';
import authTypeApi from './auth.type.api';
import authAssignmentApi from './auth.assignment.api';
import authTypeChildApi from './auth.type.child.api';

export default authApi.concat(
    userApi,
    emailApi,
    authTypeApi,
    authAssignmentApi,
    authTypeChildApi
);
