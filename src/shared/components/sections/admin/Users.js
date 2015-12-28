import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Input } from 'react-bootstrap';
import { fetchUsers, updateUser, renderServer } from '../../../actions/UsersActions';

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
  render() {
    return <div>
      <h1>Users</h1>
      <Table striped bordered condensed hover>
        <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Active</th>
        </tr>
        </thead>
        <tbody>
        {this.props.users.map((x, i) =>
          <tr key={ x.id }>
            <td>{ x.id }</td>
            <td>{ x.firstName }</td>
            <td>{ x.lastName }</td>
            <td>{ x.username }</td>
            <td>{ x.email }</td>
            <td>
              <input
                type="checkbox"
                className="col-xs-offset-2 col-xs-10"
                checked={ x.active }
                onClick={() => {this.toggleActive(x.id, x.active)}} />
            </td>
          </tr>
        )}
        </tbody>
      </Table>
    </div>
  }
}

export default connect(state => state.Users)(Users);