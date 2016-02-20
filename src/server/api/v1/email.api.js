"use strict";

import mailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { getConfig } from '../../config/config';
const config = getConfig();
import jade from 'jade';
import fetch from 'isomorphic-fetch';

const emailPath = __dirname + '/../../templates/emails';
const transport = mailer.createTransport(smtpTransport(config.mail));

class EmailApi
{
  constructor(version='v1')
  {
    this.version = version;

    this.contact = {
      handler: (request, reply) => {
        fetch(`https://www.google.com/recaptcha/api/siteverify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `secret=${config.recaptcha.secret}&response=${request.payload.captcha}`
        })
          .then(res => res.json())
          .then((data) => {
            if (data.success === true) {
              var html = jade.compileFile(emailPath + '/contact/html.jade', {})(request.payload);
              var text = jade.compileFile(emailPath + '/contact/text.jade', {})(request.payload);

              const mail = {
                from: `Administrator ${config.params.adminEmail}`,
                to: config.params.adminEmail,
                subject: "Contact Form Submission.",
                text: text,
                html: html
              };

              transport.sendMail(mail, function (error, response) {
                if (error) {
                  reply({'success': false});
                } else {
                  reply({'success': true});
                }
                transport.close();
              });
            } else {
              reply(data);
            }
          });
      }
    }
  }

  get endPoints()
  {
    var path = '/api/' + this.version + '/email';
    return [
      {
        path: path + '/contact',
        method: 'POST',
        config: this.contact
      }
    ];
  }
}

export default new EmailApi().endPoints;
