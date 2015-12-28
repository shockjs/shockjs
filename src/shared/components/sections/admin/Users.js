import React, { Component } from 'react';
import { connect } from 'react-redux';

class Users extends Component {
  static componentID = 'Users';

  /**
   * Render the component.
   */
  render() {
    return <div>
      <h1>Users</h1>
    </div>
  }
}

export default connect(state => state.Users)(Users);