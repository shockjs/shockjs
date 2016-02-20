import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchRoles,
  renderServer,
  cleanupServer,
  openRoleModal,
  closeRoleModal,
  removeRole,
  fetchChildren,
  openPermissionChildModal
} from '../../../blocks/sections/admin/permissions.block.js';
import { ListView, Pagination, ListRows, Counter } from 'react-list-combo';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import PermissionRowComponent from './permission.row.component';
import AddPermissionComponent from './modals/add.permission.component';

class PermissionsComponent extends Component
{

  static renderServer()
  {
    return renderServer();
  }

  componentDidMount()
  {
    const { dispatch, renderedServer } = this.props;
    if (renderedServer === false) {
      dispatch(fetchRoles());
    }
  }

  componentWillUnmount()
  {
    const { dispatch } = this.props;
    dispatch(cleanupServer());
  }

  fetchMore(page)
  {
    const { dispatch } = this.props;
    return dispatch(fetchRoles(page));
  }

  openRoleModal()
  {
    const { dispatch } = this.props;
    return dispatch(openRoleModal());
  }

  closeRoleModal()
  {
    const { dispatch } = this.props;
    return dispatch(closeRoleModal());
  }

  removeRole(id)
  {
    const { dispatch } = this.props;
    return dispatch(removeRole(id));
  }

  showChildren(id, toggle)
  {
    const { dispatch } = this.props;
    return dispatch(fetchChildren(id, toggle));
  }

  openPermissionChildModal(id)
  {
    const { dispatch } = this.props;
    return dispatch(openPermissionChildModal(id));
  }

  render()
  {

    // If we are loading server side and no pre-fetching is done of data.
    if (this.props.permissions === false) {
      return false;
    }

    return (
      <div>
        <div className="page-header">
          <h1>Permissions <small>modify, add or remove permissions of the website.</small></h1>
        </div>
        <ListView initData={ this.props.permissions } dataSource={ (page) => this.fetchMore(page) }>
          <ButtonToolbar bsClass="toolbar pull-left">
            <Button bsStyle="primary" onClick={ () => this.openRoleModal() }>Add permission</Button>
          </ButtonToolbar>
          <Pagination wrapperClassName="pull-right" />
          <div className="col-lg-12 list-header">
            <span className="col-lg-1">&nbsp;</span>
            <span className="col-lg-2">Label</span>
            <span className="col-lg-2">Type</span>
            <span className="col-lg-2">Name</span>
            <span className="col-lg-5">Description</span>
          </div>
          <ListRows rowClassName="col-lg-12">
            <PermissionRowComponent removeChild={ (id) => this.removeRole(id) }
                           showChildren={ (id, toggle) => this.showChildren(id, toggle) } />
          </ListRows>
          <Counter label="users" wrapperClassName="toolbar pull-left" />
          <Pagination wrapperClassName="pull-right" />
        </ListView>
        <AddPermissionComponent showModal={ this.props.showModal } closeModal={ () => this.closeRoleModal() } />
      </div>
    )
  }
}


PermissionsComponent.componentID = 'Permissions';

export default connect(state => state.Permissions)(PermissionsComponent);