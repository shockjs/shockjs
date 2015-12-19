/**
 * @file configures all routes.
 */
import App from './containers/App';
import Welcome from  './components/sections/Welcome';
import Contact from './components/sections/Contact';
import Login from './components/sections/Login';

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
