/**
 * @file configures all routes.
 */

"use strict";

import App from './components/App';
import Welcome from  './components/sections/Welcome';
import Contact from './components/sections/Contact';
import Login from './components/sections/Login';
import Admin from './components/sections/Admin';
import Dashboard from './components/sections/admin/Dashboard';
import Users from './components/sections/admin/Users';
import Permissions from './components/sections/admin/Permissions';
import { fetchAuthApi } from './ducks/App';
import { redirect, isServer } from './utils/IsoBridge';

export default {
  path: '/',
  component: App,
  indexRoute: [
    {
      component: Welcome
    }
  ],
  childRoutes: [
    {
      path: 'contact-us',
      component: Contact
    },
    {
      path: 'admin',
      component: Admin,
      onEnter: (nextState, replaceState, callback) => {

        //Make sure user is authenticated before entering.
        fetchAuthApi()
          .then((auth) => {
            if (auth.isAuthenticated) {
              callback();
            } else {
              redirect('/');
            }
          })
        .catch((err) => console.error(err));

      },
      indexRoute: [
        {
          component: Dashboard
        }
      ],
      childRoutes: [
        {
          path: 'users',
          component: Users
        },
        {
          path: 'permissions',
          component: Permissions
        }
      ]
    },
    {
      path: '/login',
      component: Login,
      onEnter: (nextState, replaceState, callback) => {

        //Redirect to home page if already logged in.
        fetchAuthApi()
          .then((data) => {
            if (data.isAuthenticated) {
              redirect('/');
            } else {
              callback();
            }
          })
          .catch((err) => console.error(err));

      }
    }
  ]
};
