"use strict";
import Checkit from 'checkit';
import Boom from 'boom';

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
                    var Auth = request.server.plugins['hapi-shelf'].model('Auth');
                    var auth = new Auth();
                    auth.attributes = request.payload;

                    auth.validate().then(function(validatedFields) {
                        reply({success: true});
                    })
                    .caught(Checkit.Error, function(err) {
                        reply(Boom.badData(err));
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