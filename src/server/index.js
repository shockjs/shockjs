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
import merge from 'lodash/object/merge';
import { fetch } from '../shared/utils/isomorphic';

// Shared store configuration.
import { configureStore } from '../shared/store/configureStore';

// Custom that will be used for client and server using react router.
import routes from "../shared/routes";

// Custom REST endpoints.
import apiRoutes from './api/v1/index';
import Schema from './graphql/v1/index';

// Override console in local scope with our own to make debug output readable.
import console from './utils/tracer';

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
          path: '/graphql/v1',
          config: {}
        }
      }
    }
  ],
  (err) => {

    if (err) {
      throw err;
    }

    // Set up our authentication.
    server.auth.strategy('session', 'cookie', config.auth);

    server.auth.default({
      mode: 'try',
      strategy: 'session'
    });

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
      config: {
        handler: {
          directory: {
            path: Path.join(__dirname, '../client/static'),
            listing: process.env.SHOCK_ENV === 'development'
          }
        }
      }
    });

    // Create REST API routes.
    server.route(apiRoutes);

    //Create a wildcard route to parse through to ReactJS Router
    server.route({
      method: 'GET',
      path: '/{p*}',
      config: {
        handler: (request, reply) =>  {

          match({routes, location: request.url.path}, (error, redirectLocation, renderProps) => {

            if (error) {
              reply.view('layouts/error', {
                content: '500 Internal Server Error.'
              }).code(500);
            } else if (renderProps) {

              // All rendered components starting from the top level App component.
              let { components } = renderProps;

              let componentData = {};

              // components[0] is the App component.
              let appComponent = components[0];
              let appComponentID = appComponent.componentID;

              //Check current users authentication.
              fetch('/api/v1/auth/session')
                .then(req => req.json())
                .then((sessionData) => {
                  console.log('sessionData:', sessionData);
                  componentData[appComponentID] = sessionData;
                  // components[1] is the top level component we routed to.
                  let { WrappedComponent: { componentID, renderServer } } = components[1];

                  // This allows us to load data before rendering to allow the client to just take over without a re-render.
                  if (componentID !== undefined && renderServer !== undefined) {
                    renderServer().then((data) => {
                        componentData[componentID] = data;
                        const store = configureStore(componentData);
                        reply.view('layouts/index', {
                          content: renderToString(<Provider store={store}><RoutingContext {...renderProps} /></Provider>),
                          jsonData: JSON.stringify(componentData) //Loads required data into the dom for client.
                        });
                      })
                      .catch((error) => {
                        reply.view('layouts/error', {
                          content: '500 Internal Server Error.'
                        }).code(500);
                      });
                  } else {
                    const store = configureStore(componentData);
                    reply.view('layouts/index', {
                      content: renderToString(<Provider store={store}><RoutingContext {...renderProps} /></Provider>),
                      jsonData: JSON.stringify(componentData)
                    });
                  }

              });
            } else {
              reply.view('layouts/error', {
                content: '404 Page not found.'
              }).code(404);
            }
          });
        }
      }
    });

    //Start out server.
    server.start(() => {
      console.log('Server running at %s', process.env.SHOCK_URI);
    });

  }
);





