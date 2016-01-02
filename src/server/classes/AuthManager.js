/**
 * @file For handling RBAC.
 */
class AuthManager
{

  constructor(knex)
  {
    this.knex = knex;
  }

  createRole(roleName, description = 'Not provided.')
  {
    return this.knex('tbl_authType').insert({
      name: roleName,
      type: 1,
      description: description,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }

  assignRole(roleName, userId)
  {
    return this.knex('tbl_authAssignment').insert({
      name: roleName,
      userID: userId
    });
  }

}

export default AuthManager;