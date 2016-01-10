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
    if (this.props.resetForm !== undefined) {
      this.props.resetForm();
    }
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
        <Alert bsStyle={ this.props.bsStyle ? this.props.bsStyle : 'danger' } onDismiss={ this.handleAlertDismiss.bind(this) } dismissAfter={ 5000 }>
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
