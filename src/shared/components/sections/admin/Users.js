import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Input } from 'react-bootstrap';
import { fetchUsers, updateUser, renderServer } from '../../../actions/UsersActions';
import Griddle from 'griddle-react';
import GridActive from '../../gridview/GridActive';
import Pagination from '../../gridview/Pagination';

class Users extends Component
{
  static componentID = 'Users';

  static renderServer()
  {
    return renderServer();
  }

  componentDidMount()
  {
    const { dispatch, renderedServer } = this.props;
    if (renderedServer === false) {
      dispatch(fetchUsers());
    }
  }

  toggleActive(key, currentValue)
  {
    const { dispatch } = this.props;
    dispatch(updateUser(key, !currentValue));
  }

  /**
   * Render the component.
   */
  render()
  {
    var meta = [
      {
        "columnName": "id",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "#"
      },
      {
        "columnName": "firstName",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "First Name"
      },
      {
        "columnName": "lastName",
        "order": 3,
        "locked": false,
        "visible": true,
        "displayName": "Last Name"
      },
      {
        "columnName": "username",
        "order": 4,
        "locked": false,
        "visible": true,
        "displayName": "Username"
      },
      {
        "columnName": "email",
        "order": 5,
        "locked": false,
        "visible": true,
        "displayName": "Email"
      },
      {
        "columnName": "active",
        "order": 6,
        "locked": false,
        "visible": true,
        "displayName": "Active",
        "customComponent": GridActive,
        "toggleActive": (id, checked) => this.toggleActive(id, checked)
      }
    ];


    return <div>
      <h1>Users</h1>

      <Griddle tableClassName="table table-striped table-bordered table-condensed"
        useGriddleStyles={ false }
        results={ this.props.users }
        columnMetadata={ meta }
        useCustomPagerComponent="true"
        customPagerComponent={Pagination}
      />

    </div>

  }
}

export default connect(state => state.Users)(Users);