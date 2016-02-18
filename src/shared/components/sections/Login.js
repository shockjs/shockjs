import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, ButtonInput, Col } from 'react-bootstrap';
import AlertAutoDismissable from '../alerts/AlertAutoDismissable';
import { submitForm } from '../../ducks/sections/Login';
import { reduxForm } from 'redux-form';
import { fetchAuth } from '../../ducks/App';
import { redirect } from '../../utils/IsoBridge';

class Login extends Component
{
  render()
  {
    const { fields: { username, password }, handleSubmit, error, resetForm, submitting, invalid } = this.props;

    const errors = (element) => {
      return {
        bsStyle: element.error ? 'error' : null,
        help: element.error
      };
    };

    return (
      <Col xs={12} md={4}>
        <div className="page-header">
          <h1>Login</h1>
        </div>
        <form onSubmit={ handleSubmit(submitForm.bind(this)) }>
          <Input { ...errors(username) } type="text" label="Username" placeholder="Enter username" {...username} />
          <Input { ...errors(password) } type="password" label="Password" placeholder="Enter password" {...password} />
          { error && <AlertAutoDismissable showAlert={true} bsStyle="danger">{ error }</AlertAutoDismissable> }
          <button disabled={ submitting || invalid } className="btn btn-primary btn-md pull-right" type="submit">
            { submitting ? <i className="fa fa-spinner fa-pulse" /> : <i className="fa fa-send" /> } Login
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

