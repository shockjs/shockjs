import React, { Component } from 'react';
import {connect} from 'react-redux';

class Login extends Component
{
  render()
  {
    return (
      <h1>Login</h1>
    );
  }
}

export default connect(state => state.Login)(Login)
