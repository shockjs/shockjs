import React, { Component } from 'react';
import { connect } from 'react-redux';
import { renderServer, cleanupServer, fetchCounts } from '../../../ducks/Dashboard';
import { Link } from 'react-router';

class Dashboard extends Component
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
        <div className="jumbotron" style={{display: 'inline-block'}}>
          <h1 style={{textAlign: 'center'}}><Link to="/admin/users">{ this.props.userCount }</Link></h1>
          <h3><Link to="/admin/users">Users</Link></h3>
        </div>
        &nbsp;
        <div className="jumbotron" style={{display: 'inline-block'}}>
          <h1 style={{textAlign: 'center'}}><Link to="/admin/roles">{ this.props.roleCount }</Link></h1>
          <h3><Link to="/admin/roles">Roles</Link></h3>
        </div>
      </div>
    );
  }
}

Dashboard.componentID = 'Dashboard';

export default connect(state => state.Dashboard)(Dashboard);