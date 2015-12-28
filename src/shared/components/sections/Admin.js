import React, { Component } from 'react';
import { connect } from 'react-redux';

class Admin extends Component {
  static componentID = 'Admin';

  /**
   * Render the component.
   */
  render() {
    return <div>{ this.props.children }</div>
  }
}

export default connect(state => state.Admin)(Admin);