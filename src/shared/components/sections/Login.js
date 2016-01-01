import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Input, ButtonInput, Col } from 'react-bootstrap';
import { submitForm } from '../../actions/LoginActions';
import { reduxForm } from 'redux-form';
import { fetchAuth } from '../../actions/AppActions';
import { isServer, redirect } from '../../utils/isomorphic';

class Login extends Component
{

  componentWillMount()
  {
    const { dispatch, app: { isAuthenticated } } = this.props;
    dispatch(fetchAuth());
    if (this.props.app.isAuthenticated) {
      redirect('/');
    }
  }

  render()
  {
    const { fields: { username, password }, handleSubmit } = this.props;

    const errorTemplate = (element) => {
      return element.touched && element.error && <Alert bsStyle="danger">{ element.error }</Alert>
    };

    return <Col xs={12} md={4}>
      <h1>Login</h1>
      <form onSubmit={ handleSubmit(submitForm.bind(this)) }>
        <Input type="text" label="Username" placeholder="Enter username" {...username} />
        { errorTemplate(username) }
        <Input type="password" label="Password" placeholder="Enter password" {...password} />
        { errorTemplate(password) }
        <ButtonInput bsStyle="success" className="pull-right" type="submit" value="Login" />
      </form>
    </Col>
  }
}

Login = reduxForm({
  form: 'login-form',
  fields: ['username', 'password']
})(Login);

export default connect((state) => {
  return {
    app: state.App,
    login: state.Login
  };
})(Login)
