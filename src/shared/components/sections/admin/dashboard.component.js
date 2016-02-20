import React, { Component } from 'react';
import { connect } from 'react-redux';
import { renderServer, cleanupServer, fetchCounts } from '../../../blocks/sections/admin/dashboard.block';
import { Link } from 'react-router';

class DashboardComponent extends Component
{

  static renderServer()
  {
    return renderServer();
  }

  componentDidMount()
  {
    const { dispatch, renderedServer } = this.props;
    if (renderedServer === false) {
      dispatch(fetchCounts());
    }
  }

  componentWillUnmount()
  {
    const { dispatch } = this.props;
    dispatch(cleanupServer());
  }

  /**
   * Render the component.
   */
  render()
  {
    return (
      <div>
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>
        <div className="jumbotron dash-section">
          <h1 style={{textAlign: 'center'}}><Link to="/admin/users">{ this.props.userCount }</Link></h1>
          <h3 className="text-center"><Link to="/admin/users">Users</Link></h3>
        </div>
        &nbsp;
        <div className="jumbotron dash-section">
          <h1 style={{textAlign: 'center'}}><Link to="/admin/permissions">{ this.props.roleCount }</Link></h1>
          <h3 className="text-center"><Link to="/admin/roles">Permissions</Link></h3>
        </div>
      </div>
    );
  }
}

DashboardComponent.componentID = 'Dashboard';

export default connect(state => state.Dashboard)(DashboardComponent);