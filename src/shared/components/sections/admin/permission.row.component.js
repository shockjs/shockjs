import React, { Component } from 'react';
import AssignAuthChildComponent from './modals/assign.auth.child.component';

class PermissionRowComponent extends Component
{
  /**
   * Render the component.
   */
  render()
  {
    const {
      id: parentID,
      label,
      name,
      type,
      description,
      showChildren,
      childrenRows,
      isPermissionsChildModalShown
    } = this.props.data;

    let icon = 'fa-plus';
    if (showChildren) {
      icon = 'fa-minus';
    }

    return (
      <div>
        <div className="row list-row lighter-row">
          <span className="col-lg-1">
            <a onClick={ () => this.props.showChildren(parentID, showChildren) }>
              <i className={ "row fa fa-1x " + icon } />
            </a>
          </span>
          <span className="col-lg-2">{ label }</span>
          <span className="col-lg-2">{ type === 1 ? 'Role' : 'Operation' }</span>
          <span className="col-lg-2">{ name }</span>
          <span className="col-lg-4">{ description }</span>
          <span className="col-lg-1 text-right row">
            <a className="fa fa-times fa-1x row" onClick={ () => this.props.remove(parentID) } />
            <a>
              <i className="row fa fa-sitemap fa-1x" onClick={ () => this.props.openPermissionChildModal(parentID) } />
            </a>
          </span>
        </div>
        { showChildren && childrenRows && childrenRows.map(permission => {
          const { id, authType: { label, description } } = permission;
          return (
            <div key={ id } className={ "list-row nested-row row operation"}>
                <span className="col-lg-1 row-header">
                  <i>OPERATION</i>
                </span>
              <span className="col-lg-5">{ label }</span>
              <span className="col-lg-5">{ description }</span>
                <span className="col-lg-1 text-right">
                  <a>
                    <i className="row fa fa-times fa-1x" onClick={ () => this.props.removeChild(id) } />
                  </a>
                </span>
            </div>
          );
        })
        }
        { showChildren && childrenRows.length == 0 && <div className="list-row nested-row row no-perms">
          <span className="col-lg-12 row-header">
            <i>NO PERMISSIONS</i>
          </span>
        </div> }
        <AssignAuthChildComponent permID={ parentID }
                    showModal={ isPermissionsChildModalShown }
                    closeModal={ () => this.props.closePermissionChildModal(parentID) } />
      </div>
    );
  }
}

PermissionRowComponent.propTypes = {
  showChildren: React.PropTypes.func,
  removeChild: React.PropTypes.func
};
PermissionRowComponent.defaultProps = { };
export default PermissionRowComponent;
