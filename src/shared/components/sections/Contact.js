"use strict";

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Input, ButtonInput, Col } from 'react-bootstrap';
import { isServer } from '../../utils/IsoBridge';
import Recaptcha from 'react-recaptcha';
import { setCaptchaKey, captchaLoaded, clearCaptchaKey, submitForm } from '../../actions/ContactActions';

class Contact extends Component
{
  render()
  {
    const {
      fields: {
        name,
        phone,
        email,
        description,
        captcha
      },
      handleSubmit,
      siteKey,
      verifyCallback,
      expiredCallback,
      onLoadCallback

    } = this.props;

    let showCaptcha = '';

    //Captcha is clientside only.
    if (!isServer()) {
      showCaptcha = (
        <Recaptcha
          sitekey={ siteKey }
          size="compact"
          render="explicit"
          verifyCallback={ verifyCallback }
          onloadCallback={ onLoadCallback }
          expiredCallback={ expiredCallback }
        />
      );
    }

    return (
      <div>
        <h1>Contact Us</h1>
        <form onSubmit={ handleSubmit(submitForm.bind(this)) }>
          <Input type="text" label="name" placeholder="Enter name" { ...name } />
          <Input type="text" label="phone" placeholder="Enter phone" { ...phone } />
          <Input type="text" label="email" placeholder="Enter email" { ...email } />
          <Input type="textarea" label="comments" placeholder="Enter comments and questions." { ...description } />
          <Input type="text" { ...captcha } />
          { showCaptcha }
          <ButtonInput bsStyle="success" className="pull-right" type="submit" value="Send" />
        </form>
      </div>
    );
  }
}

export default reduxForm(
  {
    form: 'contact-form',
    fields: ['name', 'phone', 'email', 'description', 'captcha']
  },
  state => {
    const newState = {
      initialValues: state.Contact.fieldData,
      siteKey: state.Contact.siteKey
    };
    console.log('updating state...', newState);
    return newState;
  },
  {
    verifyCallback: setCaptchaKey,
    onLoadCallback: captchaLoaded,
    expiredCallback: clearCaptchaKey
  }
)(Contact);

