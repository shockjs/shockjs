"use strict";

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Input, ButtonInput, Col, Alert } from 'react-bootstrap';
import { isServer } from '../../utils/IsoBridge';
import Recaptcha from 'react-recaptcha';
import { setCaptchaKey, captchaLoaded, clearCaptchaKey, submitForm, clearSubmitted } from '../../ducks/Contact';
import AlertAutoDismissable from '../alerts/AlertAutoDismissable';
import Error from '../form/Error';

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

    return (
      <div>
        <div className="page-header">
          <h1>Contact Us</h1>
        </div>
        <form onSubmit={ handleSubmit(submitForm.bind(this)) }>
          <AlertAutoDismissable bsStyle="success" showAlert={ submitted } resetForm={ () => dispatch(clearSubmitted()) }>
            Your request has been submitted...
          </AlertAutoDismissable>
          <Input type="text" label="Name" placeholder="Enter name" { ...name } />
          <Error element={ name } />
          <Input type="text" label="Phone" placeholder="Enter phone" { ...phone } />
          <Error element={phone } />
          <Input type="text" label="Email" placeholder="Enter email" { ...email } />
          <Error element={email } />
          <Input type="textarea" label="Comments" placeholder="Enter comments and questions." { ...comments } />
          <Error element={comments } />
          { showCaptcha }
          <Error element={captcha } />
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
)(Contact);

