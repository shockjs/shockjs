/**
 * @file For handling RBAC.
 */
class AuthManagerClass
{

  constructor(knex)
  {
    this.knex = knex;
  }

  createRole(roleLabel, roleName, description = 'Not provided.')
  {
    return this.knex('tbl_authType').insert({
      label: roleLabel,
      name: roleName,
      type: 1,
      description: description,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }

  assignRole(roleName, userId)
  {
    return this.knex
      .from('tbl_authType')
      .where('name', roleName)
      .select('id')
      .then((result) => {
        return this.knex('tbl_authAssignment').insert({
          authTypeID: result[0].id,
          userID: userId
        });
      })
      .catch((e) => {
        console.error(e);
      });

  }

}

export default AuthManagerClass;