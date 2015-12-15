/**
 * @file configures all routes.
 */
import App from './js/containers/App';
import Welcome from  './js/components/sections/Welcome';
import Contact from './js/components/sections/Contact';
import Login from './js/components/sections/Login';

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
      path: '/contact-us',
      component: Contact
    },
    {
      path: '/login',
      component: Login
    }
  ]
};
