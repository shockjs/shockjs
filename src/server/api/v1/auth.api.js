"use strict";

import Boom from 'boom';
import Auth from '../../models/auth.model';

let apiPath = '/api/v1';

export default [
  {
    path: apiPath + '/auth/login',
    method: ['GET', 'POST'],
    config: {
      handler: (request, reply) => {
        if (request.method === 'get') {
          reply(Boom.methodNotAllowed("Login request method be POST."));
        } else {
          let auth = new Auth({
            username: request.payload.username,
            password: request.payload.password
          });
          auth.login()
            .then((result) => {
              request.cookieAuth.set(result);
              reply({ success: true });
            })
            .catch((err) => {
              reply(Boom.badRequest(err));
            });
        }
      }
    }
  },
  {
    path: apiPath + '/auth/session',
    method: ['GET'],
    config: {
      handler: (request, reply) => {
        reply({
          isAuthenticated: request.auth.isAuthenticated,
          credentials: request.auth.credentials
        });
      }
    }
  },
  {
    path: apiPath + '/auth/logout',
    method: ['POST', 'GET'],
    config: {
      handler: (request, reply) => {
        request.cookieAuth.clear();
        reply({ success: true });
      }
    }
  },
  {
    path: apiPath + '/auth/register',
    method: 'GET',
    config: {
      handler: (request, reply) => {
        reply({success: true});
      }
    }
  }
];