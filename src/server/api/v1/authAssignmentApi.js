"use strict";

import RestApi from '../../classes/RestApi';
import AuthAssignment from '../../models/AuthAssignment';

class AuthAssignmentApi extends RestApi
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
      config: {
        handler: (request, reply) => {
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

        }
      }
    });


    return endPoints;
  }
}

export default new AuthAssignmentApi().endPoints;
