import React, { Component } from 'react';
import { connect } from 'react-redux';

class Contact extends Component
{
  render()
  {
    return (
      <h1>Contact Us</h1>
    );
  }
}

export default connect((state) => {
  return {
    app: state.App,
    contact: state.Contact
  };
})(Contact);
