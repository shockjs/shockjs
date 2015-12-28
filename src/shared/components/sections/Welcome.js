/**
 * @file Welcome section component
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Welcome extends Component
{
  // Easy way to identify our component since they are usually wrapped in a connect in displayName.
  static componentID = 'Welcome';

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

export default connect((state) => {
  return {
    app: state.App,
    welcome: state.Welcome
  }
})(Welcome)
