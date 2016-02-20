import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, ButtonInput, Col } from 'react-bootstrap';
import { submitForm } from '../../blocks/sections/login.block';
import { reduxForm } from 'redux-form';
import { fetchAuth } from '../../blocks/app.block';
import { redirect } from '../../utils/iso.bridge';

class LoginComponent extends Component
{
  render()
  {
    const { fields: { username, password }, handleSubmit, error, submitting, invalid } = this.props;

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
          <button disabled={ submitting } className="btn btn-primary pull-right" type="submit">
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
})(LoginComponent);

