import React, { Component } from 'react';

class UserRow extends Component
{

  /**
   * Render the component.
   */
  render()
  {
    const {
      id,
      firstName,
      lastName,
      username,
      email,
      showPermissions,
      permissions
    } = this.props.data;

    return (
      <div>
      <div className="row list-row lighter-row">
        <span className="col-lg-1">
          <a onClick={ () => this.props.showPermissions(id, showPermissions) }>
            <i className="row fa fa-plus fa-1x" />
          </a>
        </span>
        <span className="col-lg-3">{ firstName } { lastName }</span>
        <span className="col-lg-3">{ username }</span>
        <span className="col-lg-3">{ email }</span>
        <span className="col-lg-offset-1 col-lg-1 text-right row">
          <a onClick={ () => this.props.remove(id) }>
            <i className="row fa fa-times fa-1x" />
          </a>
        </span>
      </div>
        { showPermissions && permissions && permissions.map(permission => {
          const { authType: { id, label, description } } = permission;
          return (
            <div key={ id } className="bg-danger list-row shift-right row">
              <span className="col-lg-5">{ label }</span>
              <span className="col-lg-5">{ description }</span>
            </div>
          );
         }) }

      </div>
    );
  }
}

UserRow.propTypes = {
  index: React.PropTypes.number,
  data: React.PropTypes.object,
  remove: React.PropTypes.func,
  showPermissions: React.PropTypes.func
};
UserRow.defaultProps = { };
export default UserRow;
