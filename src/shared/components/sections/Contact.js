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
      fields: { name, phone, email, comments, captcha },
      handleSubmit,
      siteKey,
      verifyCallback,
      expiredCallback,
      onLoadCallback,
      submitting,
      invalid
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

    const errorTemplate = (element) => {
      return element.touched && element.error && <span className="text-error">{ element.error }</span>;
    };

    return (
      <div>
        <h1>Contact Us</h1>
        <form onSubmit={ handleSubmit(submitForm.bind(this)) }>
          <Input type="text" label="name" placeholder="Enter name" { ...name } />
          { errorTemplate(name) }
          <Input type="text" label="phone" placeholder="Enter phone" { ...phone } />
          { errorTemplate(phone) }
          <Input type="text" label="email" placeholder="Enter email" { ...email } />
          { errorTemplate(email) }
          <Input type="textarea" label="comments" placeholder="Enter comments and questions." { ...comments } />
          { errorTemplate(comments) }
          { showCaptcha }
          { errorTemplate(captcha) }
          <button disabled={ submitting || invalid } className="btn btn-primary btn-lg pull-right" type="submit">
            { submitting ? <i className="fa fa-spinner fa-pulse" /> : <i className="fa fa-send" /> } Send
          </button>
        </form>
      </div>
    );
  }
}

export default reduxForm(
  {
    form: 'contact-form',
    fields: ['name', 'phone', 'email', 'comments', 'captcha']
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

