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
            handler: function (request, reply) {
                if (request.method === 'get') {
                    reply(Boom.methodNotAllowed("Login request method be POST."));
                } else {
                    let auth = new Auth();
                    auth.attributes = request.payload;
                    auth.login()
                    .then(function(result) {
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
            handler: function (request, reply) {
                request.auth.session.clear();
                reply({success: true});
            }
        }
    },
    {
        path: apiPath + '/auth/register',
        method: 'GET',
        config: {
            handler: function (request, reply) {

                reply({success: true});
            }
        }
    }
];