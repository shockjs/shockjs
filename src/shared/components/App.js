import React, { Component } from 'react';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavBrand, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class App extends Component
{

  static componentID = 'App';

  render() {
    return (
      <div>
        <Navbar>
          <NavBrand><Link to="/">ShockJS</Link></NavBrand>
          <Nav>
            <IndexLinkContainer to="/"><NavItem>Welcome</NavItem></IndexLinkContainer>
            <LinkContainer to="/contact-us"><NavItem>Contact Us</NavItem></LinkContainer>
            <LinkContainer to="/login"><NavItem>Login</NavItem></LinkContainer>
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
