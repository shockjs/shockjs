import React, { Component } from 'react';
import { connect } from 'react-redux';

class AdminComponent extends Component
{
  /**
   * Render the component.
   */
  render()
  {
    return <div>{ this.props.children }</div>;
  }
}

AdminComponent.componentID = 'Admin';

export default connect(state => state.Admin)(AdminComponent);