/**
 * @file configures all routes.
 */

"use strict";

import AppComponent from './components/app.component';
import WelcomeComponent from  './components/sections/welcome.component';
import ContactComponent from './components/sections/contact.component';
import LoginComponent from './components/sections/login.component';
import AdminComponent from './components/sections/admin.component';
import DashboardComponent from './components/sections/admin/dashboard.component';
import UsersComponent from './components/sections/admin/users.component';
import PermissionsComponent from './components/sections/admin/permissions.component';
import { fetchAuthApi } from './components/app.block';
import { redirect, isServer } from './utils/iso.bridge';

export default {
  path: '/',
  component: AppComponent,
  indexRoute: [
    {
      component: WelcomeComponent
    }
  ],
  childRoutes: [
    {
      path: 'contact-us',
      component: ContactComponent
    },
    {
      path: 'admin',
      component: AdminComponent,
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
          component: DashboardComponent
        }
      ],
      childRoutes: [
        {
          path: 'users',
          component: UsersComponent
        },
        {
          path: 'permissions',
          component: PermissionsComponent
        }
      ]
    },
    {
      path: '/login',
      component: LoginComponent,
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
