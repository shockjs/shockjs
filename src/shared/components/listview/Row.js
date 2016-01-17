import React, { Component } from 'react';

class Row extends Component
{
  /**
   * Render the component.
   */
  render()
  {

    const { firstName, lastName, username, email } = this.props.data;

    return (
      <div className="row list-row">
        <span className="col-lg-3">{ firstName } { lastName }</span>
        <span className="col-lg-3">{ username }</span>
        <span className="col-lg-3">{ email }</span>
        <span className="col-lg-offset-2 col-lg-1 text-right">
          <a className="fa fa-times fa-lg" />
        </span>
      </div>
    );
  }
}

Row.propTypes = {
  index: React.PropTypes.number,
  data: React.PropTypes.object
};
Row.defaultProps = { };
export default Row;
