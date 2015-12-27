import React, { Component } from 'react';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
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
    const { dispatch, isAuthenticated } = this.props;

    let logoutHandler = function(node, data) {
      dispatch(logoutUser());
    };

    var authAction = <LinkContainer to="/login"><NavItem>Login</NavItem></LinkContainer>;
    if (isAuthenticated) {
      const { credentials: { firstName, lastName } } = this.props;
      authAction = <NavItem onClick={ logoutHandler }>({firstName} {lastName}) Logout</NavItem>;
    }

    return (
      <div>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">ShockJS</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <IndexLinkContainer to="/"><NavItem>Welcome</NavItem></IndexLinkContainer>
              <LinkContainer to="/contact-us"><NavItem>Contact Us</NavItem></LinkContainer>
            </Nav>
            <Nav pullRight>
              { authAction }
            </Nav>
          </Navbar.Collapse>
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
