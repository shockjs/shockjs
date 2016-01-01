import React, { Component } from 'react';
import { connect } from 'react-redux';

class Dashboard extends Component
{
  /**
   * Render the component.
   */
  render()
  {
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  }
}

Dashboard.componentID = 'Dashboard';

export default connect(state => state.Dashboard)(Dashboard);