/**
 * @module Server start.
 */

// Main configuration file.
import config from "./config.json";

// Libraries built around react.
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import { Provider } from 'react-redux';
import GraphQL from 'hapi-graphql';

// Hapi dependencies.
import Hapi from 'hapi';
import HapiShelf from 'hapi-shelf';
import Vision from 'vision';
import Inert from 'inert';
import Jade from 'jade';

// Useful libraries.
import fs from 'fs';
import Q from 'q';
import Path from 'path';

// Server store configuration (has history removed as that is client side only)
import { configureStore } from './store/configureStore';

// Custom that will be used for client and server using react router.
import routes from "../shared/routes";

// Custom REST endpoints.
import apiRoutes from './api/v1/index';
import Schema from './graphql/v1/index';

// Make fs a promise instead of a callback.
const readdir = Q.nfbind(fs.readdir);

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

// Load in the names of our models (needed for Hapishelf).
readdir(config.modelPath)
.then(function(items) {

  // Get loadable names and relative path.
  var models = items.map(function(value) {
    return (config.modelPath + '/' + value).replace(/\.js$/, '');
  });

  server.connection({ port: config.port });

  server.register(
    [
      Vision,
      Inert,
      {
        register: HapiShelf,
        options: {
          knex: config.database,
          plugins: ['registry'],
          models: models
        }
      },
      {
        register: GraphQL,
        options: {
          query: {
            schema: Schema,
            rootValue: {},
            pretty: false
          },
          route: {
            path: '/graphql',
            config: {}
          }
        }
      }
    ],
    function (err) {

      if (err) {
        throw err;
      }

      // set up jade as our basic templating for shell html files.
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
            listing: true
          }
        }
      });

      // Create REST API routes.
      apiRoutes.forEach(function(route) {
        server.route(route);
      });

      //Create a wildcard route to parse through to ReactJS Router
      server.route({
        method: 'GET',
        path: '/{p*}',
        handler: function (request, reply) {
          match({routes, location: request.url.path }, (error, redirectLocation, renderProps) => {
            if (error) {
              reply.view('layouts/error', {
                content: '500 Internal Server Error.'
              }).code(500);
            } else if (renderProps) {

              // Hacky work around to get component name and action data. @todo find a cleaner way to do this.
              var componentName = renderProps.components[1].displayName.replace(/Connect\(|\)/g, '');
              var componentObj = renderProps.components[1].WrappedComponent;

              // This allows us to load data before rendering to allow the client to just take over without a re-render.
              if (componentObj.renderServer !== undefined) {
                componentObj.renderServer().then(function(data) {
                    var componentData = {};
                    componentData[componentName] = data;
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

})
.catch(function(err) {
  console.error(err);
});




