/**
 * @file Welcome section component
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Welcome extends Component
{
  /**
   * Render our component.
   */
  render()
  {
    let fullName = 'Guest';
    if (this.props.app.isAuthenticated) {
      let { firstName, lastName } = this.props.app.credentials;
      fullName = firstName + ' ' + lastName;
    }

    return (
        <h1>Welcome { fullName }</h1>
    );
  }
}

Welcome.componentID = 'Welcome';

export default connect((state) => {
  return {
    app: state.App,
    welcome: state.Welcome
  };
})(Welcome);
