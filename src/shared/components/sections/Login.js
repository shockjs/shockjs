import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Input, ButtonInput, Col } from 'react-bootstrap';
import { submitForm } from '../../actions/LoginActions';
import { reduxForm } from 'redux-form';
import { fetchAuth } from '../../actions/AppActions';
import { redirect } from '../../utils/isomorphic';

class Login extends Component
{
  render()
  {
    const { fields: { username, password }, handleSubmit, error } = this.props;

    const errorTemplate = (element) => {
      return element.touched && element.error && <span className="text-error">{ element.error }</span>;
    };

    return (
      <Col xs={12} md={4}>
        <h1>Login</h1>
        <form onSubmit={ handleSubmit(submitForm.bind(this)) }>
          <Input type="text" label="Username" placeholder="Enter username" {...username} />
          { errorTemplate(username) }
          <Input type="password" label="Password" placeholder="Enter password" {...password} />
          { errorTemplate(password) }
          { error && <Alert bsStyle="danger">{ error }</Alert> }
          <ButtonInput bsStyle="success" className="pull-right" type="submit" value="Login" />
        </form>
      </Col>
    );
  }
}

Login = reduxForm({
  form: 'login-form',
  fields: ['username', 'password']
})(Login);

export default connect((state) => state.Login)(Login);
