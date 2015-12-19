"use strict";
import Checkit from 'checkit';
import Boom from 'boom';
import Auth from '../../models/Auth';

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
                    .then(function(result) {
                        request.auth.session.set(result);
                        reply(result);
                    })
                    .catch(function(err) {
                        reply(err);
                    });
                }
            }
        }
    },
    {
        path: apiPath + '/auth/logout',
        method: 'POST',
        config: {
            handler: (request, reply) => {
                request.auth.session.clear();
                reply({success: true});
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