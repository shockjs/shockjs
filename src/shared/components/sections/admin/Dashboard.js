import React, { Component } from 'react';
import { connect } from 'react-redux';

class Dashboard extends Component
{
  static componentID = 'Dashboard';

  /**
   * Render the component.
   */
  render()
  {
    return <div>
      <h1>Dashboard</h1>
    </div>
  }
}

export default connect(state => state.Dashboard)(Dashboard);