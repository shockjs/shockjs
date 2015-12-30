import React, { Component } from 'react';

class GridActive extends Component
{

  static componentID = 'GridActive';

  /**
   * Render the component.
   */
  render()
  {
    return <input
      type="checkbox"
      className="col-xs-offset-2 col-xs-10"
      defaultChecked={ this.props.data }
      onClick={ () => { this.props.metadata.toggleActive(this.props.rowData.id, this.props.data)} } />
  }
}

export default GridActive;