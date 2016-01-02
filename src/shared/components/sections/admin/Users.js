import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUsers, updateUser, renderServer, cleanupServer } from '../../../actions/UsersActions';
import { ListView, GridView, Pagination, GridColumn } from 'react-list-combo';
import GridActive from '../../listview/GridActive';

class Users extends Component
{
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

  componentWillUnmount()
  {
    const { dispatch } = this.props;
    dispatch(cleanupServer());
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

    return (
      <div>
        <h1>Users</h1>

        <ListView initData={ this.props.users } dataSource={ this.fetchMore.bind(this) }>
          <GridView tableClassName="table table-bordered table-response table-hover table-condensed">
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
    );
  }
}

Users.componentID = 'Users';

export default connect(state => state.Users)(Users);