import React, { Component } from 'react';

class RoleRow extends Component
{
  /**
   * Render the component.
   */
  render()
  {
    const { name, description } = this.props.data;

    return (
      <div className="row list-row">
        <span className="col-lg-4">{ name }</span>
        <span className="col-lg-4">{ description }</span>
        <span className="col-lg-offset-3 col-lg-1 text-right">
          <a className="fa fa-times fa-lg" onClick={ () => this.props.remove(name) } />
        </span>
      </div>
    );
  }
}

RoleRow.propTypes = { };
RoleRow.defaultProps = { };
export default RoleRow;
