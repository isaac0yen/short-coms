const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');
const Replacer = require('./Replacer.js');
const fs = require('fs');
const { _MySQL } = require('./_MySQL.js');
const Logger = require('./Logger.js');
const ThrowError = require('./ThrowError.js');
const Capitalize = require('./Capitalize.js');
dotenv.config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

const Mail = {
  Welcome: async (email, name) => {
    const templatePath = path.join(__dirname, '../email templates/Welcome.html');
    const template = fs.readFileSync(templatePath, 'utf8');

    try {
      if (name) {

        const Mail = Replacer(template, { APP_NAME: _CONFIG.APP_NAME, USER_NAME: `${Capitalize(name)}` });

        let mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Welcome to ' + _CONFIG.APP_NAME,
          html: Mail,
        };

        await transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            Logger('There was an error sending the email on line 43 //There\'s some extra stuff \n\n\n' + info.line, error);
          }
        });
      } else {
        ThrowError('ERROR_SENDING_MAIL')
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  SendCode: async (email, name, code) => {
    const templatePath = path.join(__dirname, '../email templates/Code.html');
    const template = fs.readFileSync(templatePath, 'utf8');

    try {

      const Mail = Replacer(template, { APP_NAME: _CONFIG.APP_NAME, USER_NAME: `${Capitalize(name)}`, CODE: code });

      let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: _CONFIG.APP_NAME + ' Login Code',
        html: Mail,
      };

      await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          Logger('There was an error sending the email on line 43 //There\'s some extra stuff \n\n\n' + info.line, error);
        }
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  sendMail: async (email, content, subject) => {

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject,
      html: content,
    };


    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        Logger('There was an error sending the email on line 170 //There\'s some extra stuff \n\n\n' + info.line, error);
      }
    });
  }

};

module.exports = Mail;
