import React, { Component } from 'react';
import { connect } from 'react-redux';

class Admin extends Component
{
  /**
   * Render the component.
   */
  render()
  {
    return <div>{ this.props.children }</div>;
  }
}

Admin.componentID = 'Admin';

export default connect(state => state.Admin)(Admin);