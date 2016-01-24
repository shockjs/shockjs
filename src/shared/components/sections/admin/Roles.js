import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchRoles, renderServer, cleanupServer, openRoleModal, closeRoleModal, removeRole } from '../../../ducks/Roles';
import { ListView, Pagination, ListRows, Counter } from 'react-list-combo';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import RoleRow from './RoleRow';
import AddRole from './modals/AddRole';

class Roles extends Component
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

  render()
  {

    // If we are loading server side and no pre-fetching is done of data.
    if (this.props.roles === false) {
      return false;
    }

    return (
      <div>
        <div className="page-header">
          <h1>Roles <small>modify, add or remove roles of the website.</small></h1>
        </div>
        <ListView initData={ this.props.roles } dataSource={ (page) => this.fetchMore(page) }>
          <ButtonToolbar bsClass="toolbar pull-left">
            <Button bsStyle="primary" onClick={ () => this.openRoleModal() }>Add role</Button>
          </ButtonToolbar>
          <Pagination wrapperClassName="pull-right" />
          <div className="col-lg-12 list-header">
            <span className="col-lg-4">Name</span>
            <span className="col-lg-4">Description</span>
          </div>
          <ListRows rowClassName="col-lg-12">
            <RoleRow remove={ (id) => this.removeRole(id) } />
          </ListRows>
          <Counter label="users" wrapperClassName="toolbar pull-left" />
          <Pagination wrapperClassName="pull-right" />
        </ListView>
        <AddRole showModal={ this.props.showModal } closeModal={ () => this.closeRoleModal() } />
      </div>
    )
  }
}


Roles.componentID = 'Roles';

export default connect(state => state.Roles)(Roles);