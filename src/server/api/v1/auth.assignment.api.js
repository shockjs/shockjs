"use strict";

import RestApiClass from '../../classes/rest.api.class';
import AuthAssignment from '../../models/auth.assignment.model';

class AuthAssignmentApi extends RestApiClass
{
  constructor()
  {
    super('auth-assignment', AuthAssignment);
  }

  get endPoints()
  {
    let endPoints = super.endPoints;
    // Push extra endpoint here or delete them.

    endPoints.push({
      path: `/api/${this.version}/${this.endPoint}/test`,
      method: 'GET',
      config: this.beforeAction((request, reply) => {
        this.model.where('id', 2)
          .fetch({
            withRelated: ['authType']
          })
          .then(function(model) {
            reply(model.toJSON());
          })
          .catch(function(err) {
            reply(err);
          });
      })
    });


    return endPoints;
  }
}

export default new AuthAssignmentApi().endPoints;
