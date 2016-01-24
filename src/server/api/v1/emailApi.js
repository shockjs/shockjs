"use strict";

import mailer from 'nodemailer';
import { getConfig } from '../../config/index';
const config = getConfig();
import jade from 'jade';
import fetch from 'isomorphic-fetch';

const emailPath = __dirname + '/../../templates/emails';
const smtpTransport = mailer.createTransport("SMTP", config.mail);

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

              smtpTransport.sendMail(mail, function (error, response) {
                if (error) {
                  reply({'success': false});
                } else {
                  console.log("Message sent: " + response.message);
                  reply({'success': true});
                }
                smtpTransport.close();
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
