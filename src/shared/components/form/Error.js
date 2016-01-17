import React, { Component } from 'react';

class Error extends Component
{
  /**
   * Render the component.
   */
  render()
  {
    const { element } = this.props;
    if (element.touched && element.error) {
      return (
        <span className="text-error">
        { element.error }
      </span>
      );
    } else {
      return false;
    }

  }
}

Error.propTypes = { };
Error.defaultProps = { };
export default Error;
