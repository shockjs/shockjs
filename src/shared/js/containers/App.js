const React = require('react');
const ReactRouterBootstrap = require('react-router-bootstrap');
const LinkContainer = ReactRouterBootstrap.LinkContainer;
const ReactBootstrap = require('react-bootstrap');
const Nav = ReactBootstrap.Nav;
const Navbar = ReactBootstrap.Navbar;
const NavBrand = ReactBootstrap.NavBrand;
const NavItem = ReactBootstrap.NavItem;
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;

module.exports = React.createClass({
  render() {
    return (
      <div>
        <Navbar>
          <NavBrand><Link to="/">ShockJS</Link></NavBrand>
          <Nav>
            <LinkContainer to="/"><NavItem eventKey={1}>Welcome</NavItem></LinkContainer>
            <LinkContainer to="/contact-us"><NavItem eventKey={2}>Contact Us</NavItem></LinkContainer>
            <LinkContainer to="/login"><NavItem eventKey={3}>Login</NavItem></LinkContainer>
          </Nav>
        </Navbar>

        {/*
         next we replace `<Child>` with `this.props.children`
         the router will figure out the children for us
         */}
        {this.props.children}
      </div>
    )
  }
});
