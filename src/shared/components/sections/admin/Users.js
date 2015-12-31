import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Input } from 'react-bootstrap';
import { fetchUsers, updateUser, renderServer } from '../../../actions/UsersActions';
import GridView from '../../gridview/GridView';
import GridActive from '../../gridview/GridActive';
import Pagination from '../../gridview/Pagination';
import GridColumn from '../../gridview/GridColumn';
import ListView from '../../gridview/ListView';

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

  fetchMore(page)
  {
    const { dispatch } = this.props;
    return dispatch(fetchUsers(page));
  }

  /**
   * Render the component.
   */
  render()
  {

    // If we are loading server side and no prefetching is done of data.
    if (this.props.users === false) {
      return false;
    }

    return <div>
      <h1>Users</h1>

      <ListView initData={ this.props.users } dataSource={ this.fetchMore.bind(this) }>
        <GridView>
          <GridColumn header="#" name="id" />
          <GridColumn header="First Name" name="firstName" />
          <GridColumn header="Last Name" name="lastName" />
          <GridColumn header="Username" name="username" />
          <GridColumn header="Active" name="active">
            <GridActive toggleActive={ (id, checked) => this.toggleActive(id, checked) } primaryKey="id" />
          </GridColumn>
        </GridView>
        <Pagination />
      </ListView>

    </div>

  }
}

export default connect(state => state.Users)(Users);