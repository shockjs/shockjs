import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchUsers,
  updateUser,
  renderServer,
  cleanupServer,
  openUserModal,
  closeUserModal,
  removeUser,
  fetchPermissions,
  removePermission,
  openPermissionModal,
  closePermissionModal

} from '../../../ducks/sections/admin/Users';
import { ListView, Pagination, ListRows, Counter } from 'react-list-combo';
import GridActive from '../../listview/GridActive';
import UserRow from './UserRow';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import AddUser from './modals/AddUser';

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

  openUserModal()
  {
    const { dispatch } = this.props;
    return dispatch(openUserModal());
  }

  closeUserModal()
  {
    const { dispatch } = this.props;
    return dispatch(closeUserModal());
  }

  removeUser(id)
  {
    const { dispatch } = this.props;
    return dispatch(removeUser(id));
  }

  showPermissions(id, showPermissions)
  {
    const { dispatch } = this.props;
    return dispatch(fetchPermissions(id, showPermissions));
  }

  removePermission(id)
  {
    const { dispatch } = this.props;
    return dispatch(removePermission(id));
  }

  assignPermissions(id)
  {
    const { dispatch } = this.props;
  }

  openPermissionModal()
  {
    const { dispatch } = this.props;
    return dispatch(openPermissionModal());
  }

  closePermissionModal()
  {
    const { dispatch } = this.props;
    return dispatch(closePermissionModal());
  }

  /**
   * Render the component.
   */
  render()
  {

    // If we are loading server side and no pre-fetching is done of data.
    if (this.props.users === false) {
      return false;
    }

    return (
      <div>
        <div className="page-header">
          <h1>Users <small>modify, add or remove users of the website.</small></h1>
        </div>
        <ListView initData={ this.props.users } dataSource={ (page) => this.fetchMore(page) }>
          <ButtonToolbar bsClass="toolbar pull-left">
            <Button bsStyle="primary" onClick={ () => this.openUserModal() }>Add user</Button>
          </ButtonToolbar>
          <Pagination wrapperClassName="pull-right" />
          <div className="col-lg-12 list-header">
            <span className="col-lg-1">&nbsp;</span>
            <span className="col-lg-3">Name</span>
            <span className="col-lg-3">Username</span>
            <span className="col-lg-3">Email</span>
            <span className="col-lg-2">&nbsp;</span>
          </div>
          <ListRows rowClassName="col-lg-12">
            <UserRow remove={ id => this.removeUser(id) }
                     showPermissions={ (id, showPermissions) => this.showPermissions(id, showPermissions) }
                     removePermission={ (id) => this.removePermission(id) }
                     assignPermissions={ (id) => this.assignPermissions(id) }
                     isPermissionModalShown={ this.props.isPermissionsModalShown }
                     openPermissionModal={ () => this.openPermissionModal() }
                     closePermissionModal={ () => this.closePermissionModal() }
            />
          </ListRows>
          <Counter label="users" wrapperClassName="toolbar pull-left" />
          <Pagination wrapperClassName="pull-right" />
        </ListView>
        <AddUser showModal={ this.props.showModal } closeModal={ () => this.closeUserModal() } />
      </div>
    );
  }
}

Users.componentID = 'Users';

export default connect(state => state.Users)(Users);