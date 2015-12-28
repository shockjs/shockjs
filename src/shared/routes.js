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
      indexRoute: [
        {
          component: Dashboard
        }
      ],
      childRoutes: [
        {
          path: 'users',
          component: Users,
          onEnter: (currentState, replaceState) => {
            console.log(currentState);
          }
        },
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
};
