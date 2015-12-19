import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Input, ButtonInput, Col } from 'react-bootstrap';
import { submitForm } from '../../actions/LoginActions';
import { reduxForm } from 'redux-form';

class Login extends Component
{

  render()
  {
    const { fields: { username, password }, handleSubmit } = this.props;

    return <Col xs={6} md={4}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(submitForm.bind(this))}>
        <Input type="text" label="Username" placeholder="Enter username" {...username} />
        <Input type="password" label="Password" placeholder="Enter password" {...password} />
        <ButtonInput bsStyle="success" className="pull-right" type="submit" value="Login" />
      </form>
    </Col>
  }
}

Login = reduxForm({
  form: 'login-form',
  fields: ['username', 'password']
})(Login);

export default connect(state => state.Login)(Login)
