import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, ButtonInput, Col } from 'react-bootstrap';
import AlertAutoDismissable from '../alerts/AlertAutoDismissable';
import { submitForm } from '../../actions/LoginActions';
import { reduxForm } from 'redux-form';
import { fetchAuth } from '../../actions/AppActions';
import { redirect } from '../../utils/IsoBridge';

class Login extends Component
{
  render()
  {
    const { fields: { username, password }, handleSubmit, error, resetForm, submitting, invalid } = this.props;

    const errorTemplate = (element) => {
      return element.touched && element.error && <span className="text-error">{ element.error }</span>;
    };

    return (
      <Col xs={12} md={4}>
        <div className="page-header">
          <h1>Login</h1>
        </div>
        <form onSubmit={ handleSubmit(submitForm.bind(this)) }>
          <Input type="text" label="Username" placeholder="Enter username" {...username} />
          { errorTemplate(username) }
          <Input type="password" label="Password" placeholder="Enter password" {...password} />
          { errorTemplate(password) }
          { error && <AlertAutoDismissable showAlert={true} resetForm={resetForm} bsStyle="danger">{ error }</AlertAutoDismissable> }
          <button disabled={ submitting || invalid } className="btn btn-primary btn-lg pull-right" type="submit">
            { submitting ? <i className="fa fa-spinner fa-pulse" /> : <i className="fa fa-user" /> } Login
          </button>
        </form>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'login-form',
  fields: ['username', 'password']
})(Login);

