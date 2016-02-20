"use strict";

import RestApiClass from '../../classes/rest.api.class';
import User from '../../models/user.model';
import { getKnex } from '../../config/config';

class UserApi extends RestApiClass
{
  constructor()
  {
    super('users', User);
  }

  get endPoints()
  {
    let endPoints = super.endPoints;
    // Push extra endpoint here, manipulate them or delete them.

    /**
     * Unique email endpoint.
     */
    endPoints.push({
      path: `/api/${this.version}/${this.endPoint}/unique-email`,
      method: 'POST',
      config: {
        handler: (request, reply) => {
          let payload = request.payload;
          try {
            payload = JSON.parse(payload);
          } catch (e) {
            // Do nothing...
          }
          let query = getKnex()(User.tableName)
            .where({
              email: payload.email
            });

          if (payload.id) {
            query.andWhere('id', '<>', payload.id)
          }

          query.then((data) => {
              reply(data.length === 0);
            });
        }
      }
    });

    /**
     * Unique username endpoint.
     */
    endPoints.push({
      path: `/api/${this.version}/${this.endPoint}/unique-username`,
      method: 'POST',
      config: {
        handler: (request, reply) => {
          let payload = request.payload;
          try {
            payload = JSON.parse(payload);
          } catch (e) {
            // Do nothing...
          }
          let query = getKnex()(User.tableName)
            .where({
              username: payload.username
            });

          if (payload.id) {
            query.andWhere('id', '<>', payload.id)
          }

          query.then((data) => {
            reply(data.length === 0);
          });
        }
      }
    });

    return endPoints;
  }
}

export default new UserApi().endPoints;
