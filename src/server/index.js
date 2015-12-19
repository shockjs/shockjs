/**
 * @module Server start.
 */

// Main configuration file.
import { getConfig, exposeUrl } from "./config/index";

// Libraries built around react.
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import { Provider } from 'react-redux';

// Hapi dependencies and plugins.
import Hapi from 'hapi';
import Vision from 'vision';
import Inert from 'inert';
import Jade from 'jade';
import Boom from 'boom';
import HapiCookieAuth from 'hapi-auth-cookie';
import GraphQL from 'hapi-graphql';

// Useful libraries.
import Path from 'path';

// Server store configuration (has history removed as that is client side only)
import { configureStore } from './store/configureStore';

// Custom that will be used for client and server using react router.
import routes from "../shared/routes";

// Custom REST endpoints.
import apiRoutes from './api/v1/index';
import Schema from './graphql/v1/index';

// Fetch our configuration.
const config = getConfig();

// Expose our full uri to our application.
process.env.SHOCK_URI = exposeUrl();

// Initiate our server.
const server = new Hapi.Server({
  debug: {
    request: ['error']
  },
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '../client/static')
      }
    }
  }
});

server.connection({ port: config.port });

server.register(
  [
    HapiCookieAuth,
    Vision,
    Inert,
    {
      register: GraphQL,
      options: {
        query: {
          schema: Schema,
          rootValue: {},
          pretty: false
        },
        route: {
          path: '/v1/graphql',
          config: {}
        }
      }
    }
  ],
  function (err) {

    if (err) {
      throw err;
    }

    // Set up our authentication.
    server.auth.strategy('passport', 'cookie', config.auth);

    // set up jade as our basic template engine.
    server.views({
      engines: {
        'jade': Jade
      },
      path: __dirname + '/templates',
      compileOptions: {
        pretty: true
      }
    });

    // Add a static route for client content.
    server.route({
      method: 'GET',
      path: '/static/{p*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../client/static'),
          listing: process.env.SHOCK_ENV === 'development'
        }
      }
    });

    // Create REST API routes.
    server.route(apiRoutes);

    //Create a wildcard route to parse through to ReactJS Router
    server.route({
      method: 'GET',
      path: '/{p*}',
      handler: function (request, reply) {

        // Redirect users to home page that are already logged in if accessing login or register pages.
        switch (request.url.path) {
          case '/register':
          case '/login':
            // Redirect if already authenticated.
            if (request.auth.isAuthenticated) {
              return reply.redirect('/');
            }
            break;
        }

        match({routes, location: request.url.path }, (error, redirectLocation, renderProps) => {

          if (error) {
            reply.view('layouts/error', {
              content: '500 Internal Server Error.'
            }).code(500);
          } else if (renderProps) {

            // All rendered components starting from the top level App component.
            let { components } = renderProps;

            // components[0] is the App component.
            let appComponent = components[0];

            // components[1] is the top level component we routed to.
            let { displayName, WrappedComponent: { renderServer } } = components[1];

            // This allows us to load data before rendering to allow the client to just take over without a re-render.
            if (renderServer !== undefined) {
              renderServer().then(function(data) {
                  let componentData = {};
                  //Make sure Component name is not wrapped in Connect as added by react-redux in connect.
                  componentData[displayName.replace(/Connect\(|\)/g, '')] = data;
                  const store = configureStore(componentData);
                  reply.view('layouts/index', {
                    content: renderToString(<Provider store={store}><RoutingContext {...renderProps} /></Provider>),
                    jsonData: JSON.stringify(componentData) //Loads required data into the dom for client.
                  });
                })
                .catch(function(error) {
                  reply.view('layouts/error', {
                    content: '500 Internal Server Error.'
                  }).code(500);
                });
            } else {
              const store = configureStore();
              reply.view('layouts/index', {
                content: renderToString(<Provider store={store}><RoutingContext {...renderProps} /></Provider>),
                jsonData: JSON.stringify({})
              });
            }
          } else {
            reply.view('layouts/error', {
              content: '404 Page not found.'
            }).code(404);
          }
        });
      }
    });

    //Start out server.
    server.start(function () {
      console.log('Server running at:', server.info.uri);
    });

  }
);





