import React, { Component } from 'react';
import { getAuthType } from '../../../models/AuthType';
import Base from '../../../../client/models/Base';
import AssignAuth from './modals/AssignAuth';
const AuthType = getAuthType(Base);

class UserRow extends Component
{

  /**
   * Render the component.
   */
  render()
  {
    const {
      id: userID,
      firstName,
      lastName,
      username,
      email,
      showPermissions,
      permissions,
      isPermissionsModalShown
    } = this.props.data;

    let icon = 'fa-plus';
    if (showPermissions) {
      icon = 'fa-minus';
    }

    return (
      <div>
        <div className="row list-row lighter-row">
          <span className="col-lg-1">
            <a onClick={ () => this.props.showPermissions(userID, showPermissions) }>
              <i className={ "row fa fa-1x " + icon } />
            </a>
          </span>
          <span className="col-lg-3">{ firstName } { lastName }</span>
          <span className="col-lg-3">{ username }</span>
          <span className="col-lg-3">{ email }</span>
          <span className="col-lg-2 text-right row">
            <a onClick={ () => this.props.remove(userID) }>
              <i className="row fa fa-times fa-1x" />
            </a>
            <a onClick={ () => this.props.openPermissionModal(userID) }>
              <i className="row fa fa-sitemap fa-1x" />
            </a>
          </span>
        </div>
        { showPermissions && permissions && permissions.map(permission => {
            const { id, authType: { type, label, description } } = permission;
            return (
              <div key={ id } className={ "list-row nested-row row " + (type === AuthType.ROLE ? 'role' : 'operation') }>
                <span className="col-lg-1 row-header">
                  <i>{ type === AuthType.ROLE ? 'ROLE' : 'OPERATION' }</i>
                </span>
                <span className="col-lg-5">{ label }</span>
                <span className="col-lg-5">{ description }</span>
                <span className="col-lg-1 text-right">
                  <a>
                    <i className="row fa fa-times fa-1x" onClick={ () => this.props.removePermission(id, userID) } />
                  </a>
                </span>
              </div>
            );
          })
        }
        { showPermissions && permissions.length == 0 && <div className="list-row nested-row row no-perms">
          <span className="col-lg-12 row-header">
            <i>NO PERMISSIONS</i>
          </span>
        </div> }
        <AssignAuth userID={ userID }
                    showModal={ isPermissionsModalShown }
                    closeModal={ () => this.props.closePermissionModal(userID) } />
      </div>
    );
  }
}

UserRow.propTypes = {
  index: React.PropTypes.number,
  data: React.PropTypes.object,
  remove: React.PropTypes.func,
  showPermissions: React.PropTypes.func,
  assignPermissions: React.PropTypes.func,
  removePermission: React.PropTypes.func
};
UserRow.defaultProps = { };
export default UserRow;
