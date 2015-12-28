/**
 * @file For handling RBAC.
 */
class AuthManager
{

  constructor(db)
  {
    this.db = db;
  }

  createRole(roleName, description = 'Not provided.')
  {
    return this.db('tbl_authType').insert({
      name: roleName,
      type: 1,
      description: description,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }

  assignRole(roleName, userId)
  {
    return this.db('tbl_authAssignment').insert({
      name: roleName,
      userID: userId
    });
  }

}

export default AuthManager;