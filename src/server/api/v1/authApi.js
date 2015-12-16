"use strict";

let apiPath = '/api/v1';

module.exports = [
    {
        path: apiPath + '/auth/login',
        method: 'GET',
        config: {
            handler: function (request, reply) {

                reply({success: true});
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