import React, { Component } from 'react';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchAuthApi, fetchAuth, logoutUser } from '../blocks/app.block.js';

class AppComponent extends Component
{
  static renderServer()
  {
    return fetchAuthApi();
  }

  logoutHandler() {
    const { dispatch } = this.props;
    dispatch(logoutUser());
  }

  /**
   * Render the component.
   */
  render()
  {
    const { isAuthenticated } = this.props;

    let menus = [];

    var authAction = <LinkContainer to="/login"><NavItem>Login</NavItem></LinkContainer>;
    if (isAuthenticated) {

      menus.push(
        <NavDropdown key="admin" title="Admin" id="basic-nav-dropdown">
          <IndexLinkContainer key="dashboard" to="/admin"><MenuItem>Dashboard</MenuItem></IndexLinkContainer>
          <LinkContainer key="users" to="/admin/users"><MenuItem>Users</MenuItem></LinkContainer>
          <LinkContainer key="permissions" to="/admin/permissions"><MenuItem>Permissions</MenuItem></LinkContainer>
        </NavDropdown>
      );

      const { credentials: { username } } = this.props;
      authAction = <NavItem onClick={ () => this.logoutHandler() }>({ username }) Logout</NavItem>;
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
    );
  }
}

AppComponent.componentID = 'App';

export default connect(state => state.App)(AppComponent);
