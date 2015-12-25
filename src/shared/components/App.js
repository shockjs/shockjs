import React, { Component } from 'react';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavBrand, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchAuth, logoutUser } from '../actions/AppActions';

class App extends Component
{
  static componentID = 'App';

  /**
   * Render the component.
   */
  render()
  {

    var authAction = <LinkContainer to="/login"><NavItem>Login</NavItem></LinkContainer>;
    if (this.props.isAuthenticated) {
      authAction = <NavItem onClick={ logoutUser }>Logout</NavItem>;
    }

    return (
      <div>
        <Navbar>
          <NavBrand><Link to="/">ShockJS</Link></NavBrand>
          <Nav>
            <IndexLinkContainer to="/"><NavItem>Welcome</NavItem></IndexLinkContainer>
            <LinkContainer to="/contact-us"><NavItem>Contact Us</NavItem></LinkContainer>
            { authAction }
          </Nav>
        </Navbar>
        {/*
         next we replace `<Child>` with `this.props.children`
         the router will figure out the children for us
         */}
        { this.props.children }
      </div>
    )
  }
}

export default connect(state => state.App)(App);
