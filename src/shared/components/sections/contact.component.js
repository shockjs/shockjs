"use strict";

import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { Input } from 'react-bootstrap';
import { isServer } from '../../utils/iso.bridge';
import Recaptcha from 'react-recaptcha';
import { setCaptchaKey, captchaLoaded, clearCaptchaKey, submitForm, clearSubmitted } from '../../components/sections/contact.block';
import AlertDismissComponent from '../alerts/alert.dismiss.component';
import ErrorComponent from '../form/error.component';

class ContactComponent extends Component
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
      invalid,
      submitted,
      dispatch
    } = this.props;

    let showCaptcha = '';

    //Captcha is client side only.
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

    const errors = (element) => {
      return {
        bsStyle: element.error ? 'error' : null,
        help: element.error
      };
    };

    return (
      <div>
        <div className="page-header">
          <h1>Contact Us</h1>
        </div>
        <form onSubmit={ handleSubmit(submitForm.bind(this)) }>
          <AlertDismissComponent bsStyle="success" showAlert={ submitted } resetForm={ () => dispatch(clearSubmitted()) }>
            Your request has been submitted...
          </AlertDismissComponent>
          <Input { ...errors(name) } type="text" label="Name" placeholder="Enter name" { ...name } />
          <Input { ...errors(phone) } type="text" label="Phone" placeholder="Enter phone" { ...phone } />
          <Input { ...errors(email) } type="text" label="Email" placeholder="Enter email" { ...email } />
          <Input { ...errors(comments) } type="textarea" label="Comments" placeholder="Enter comments and questions." { ...comments } />
          { showCaptcha }
          <ErrorComponent element={captcha } />
          <button disabled={ submitting || invalid } className="btn btn-primary pull-right" type="submit">
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
      siteKey: state.Contact.siteKey,
      submitted: state.Contact.submitted
    };
    console.log('updating state...', newState);
    return newState;
  },
  {
    verifyCallback: setCaptchaKey,
    onLoadCallback: captchaLoaded,
    expiredCallback: clearCaptchaKey
  }
)(ContactComponent);

