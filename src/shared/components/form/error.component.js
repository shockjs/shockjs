import React, { Component } from 'react';

class ErrorComponent extends Component
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

ErrorComponent.propTypes = { };
ErrorComponent.defaultProps = { };
export default ErrorComponent;
