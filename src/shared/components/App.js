import React, { Component } from 'react';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchAuthApi, fetchAuth, logoutUser } from '../actions/AppActions';

class App extends Component
{
  static componentID = 'App';

  static renderServer()
  {
    return fetchAuthApi();
  }

  /**
   * Render the component.
   */
  render()
  {
    const { dispatch, isAuthenticated } = this.props;
    let menus = [];

    let logoutHandler = function(node, data) {
      dispatch(logoutUser());
    };

    var authAction = <LinkContainer to="/login"><NavItem>Login</NavItem></LinkContainer>;
    if (isAuthenticated) {

      menus.push(
        <NavDropdown title="Admin" id="basic-nav-dropdown">
          <LinkContainer key="dashboard" to="/admin"><MenuItem>Dashboard</MenuItem></LinkContainer>
          <LinkContainer key="users" to="/admin/users"><MenuItem>Users</MenuItem></LinkContainer>
        </NavDropdown>
      );

      const { credentials: { username } } = this.props;
      authAction = <NavItem onClick={ logoutHandler }>({ username }) Logout</NavItem>;
    }

    return (
      <div>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/"><img className="pull-left" src="/static/icon.png" /> ShockJS</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav inverse>
              <IndexLinkContainer to="/"><NavItem>Welcome</NavItem></IndexLinkContainer>
              <LinkContainer to="/contact-us"><NavItem>Contact Us</NavItem></LinkContainer>
              { menus }
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
        <div className="container">
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default connect(state => state.App)(App);
