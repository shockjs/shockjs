"use strict";

import mailer from 'nodemailer';
import { getConfig } from '../../config/index';
const config = getConfig();

const smtpTransport = mailer.createTransport("SMTP",config.mail);

class EmailApi
{
  constructor(version='v1')
  {
    this.version = version;

    this.contact = {
      handler: (request, reply) => {

        const mail = {
          from: `Administrator <${adminEmail}>`,
          to: config.params.adminEmail,
          subject: "Contact Form Submission.",
          text: `
            You have received the following contact request:\n
            Name: ${request.payload.name}\n
            Phone: ${request.payload.phone}\n
            Email: ${request.payload.email}\n
            Comments: ${request.payload.comments}\n
          `,
          html: `
            <h4>You have received the following contact request:</h4>
            <p>
              <b>Name: </b>${request.payload.name}
            </p>
            <p>
              <b>Phone: </b>${request.payload.phone}
            </p>
            <p>
              <b>Email: </b>${request.payload.email}
            </p>
            <p>
              <b>Comments: </b>${request.payload.comments}
            </p>
          `
        };

        smtpTransport.sendMail(mail, function(error, response){
          if(error) {
            console.log(error);
            reply({ 'success': false });
          } else {
            console.log("Message sent: " + response.message);
            reply({ 'success': true });
          }

          smtpTransport.close();

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
