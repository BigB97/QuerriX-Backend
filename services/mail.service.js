const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const CustomError = require('../utils/custom-error');

// EmailService

const sendEmail = async (to, subject, html) => {
  // Step 1
  const auth = {
    auth: {
      api_key: process.env.MAILER_KEY,
      domain: process.env.MAILER_DOMAIN,
    },
  }; // Nodemailer Keys

  // Step 2
  // Nodemailer transport with mailgun ass smtp
  const transporter = nodemailer.createTransport(mailGun(auth));
  // Options for template email
  const options = {
    viewEngine: {
      extName: '.handlebars', // handlebars extension
      partialsDir: path.resolve(__dirname, 'views'), // location of your subtemplates aka. header, footer etc
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, 'views'),
    extName: '.handlebars',
  };

  transporter.use('compile', hbs(options));
  console.log(tempVar);
  // Step 3
  const mailOptions = {
    from: '"Querrix" <youremail@yourdomain.com>', // TODO: email sender
    to: Array.isArray(to) ? to.join() : to, // TODO: email receiver
    subject,
    html,
  };

  // Step 4
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log('Error', err);
      throw new CustomError('Email Error', err);
    }
    console.log('Sucess', data);
  });
};

module.exports = sendEmail;
