import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class AlertAutoDismissable extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      alertVisible: this.props.showAlert
    };
  }

  handleAlertDismiss()
  {
    this.setState({ alertVisible: false });
    this.props.resetForm();
  }

  handleAlertShow()
  {
    this.setState({ alertVisible: true });
  }

  componentWillReceiveProps(nextProps)
  {
    this.setState({ alertVisible: nextProps.showAlert });
  }

  /**
   * Render the component.
   */
  render()
  {
    if (this.state.alertVisible) {
      return (
        <Alert bsStyle="danger" onDismiss={ this.handleAlertDismiss.bind(this) } dismissAfter={ 2000 }>
          { this.props.children }
        </Alert>
      );
    }
    return false;
  }
}

AlertAutoDismissable.propTypes = {
  showAlert: React.PropTypes.bool,
  resetForm: React.PropTypes.func
};
AlertAutoDismissable.defaultProps = { };

export default AlertAutoDismissable;
