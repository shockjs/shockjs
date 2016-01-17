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
      <div>
        <div className="page-header">
          <h1>Welcome { fullName }</h1>
        </div>
        <p>
          This is the homepage. To edit this page, edit the following file:
        </p>
        <pre>/src/shared/components/section/Welcome.js</pre>
        <p>All other top level pages can be found in the same directory.</p>
        <p>To alter the routes edit the following file:</p>
        <pre>/src/shared/routes.js</pre>
        <p>To alter the navbar edit the following file:</p>
        <pre>/src/shared/components/App.js</pre>
      </div>
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
