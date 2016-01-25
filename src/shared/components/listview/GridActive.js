import React, { Component } from 'react';

class GridActive extends Component
{

  /**
   * Render the component.
   */
  render()
  {
    return (
      <input type="checkbox"
        defaultChecked={ this.props.data }
        onClick={ () => this.props.toggleActive(this.props.row[this.props.idAttribute], this.props.data) } />
    );
  }
}

GridActive.propTypes = {
  idAttribute: React.PropTypes.string,
  toggleActive: React.PropTypes.func,
  data: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  row: React.PropTypes.object
};

export default GridActive;