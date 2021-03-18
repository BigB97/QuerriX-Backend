const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const CustomError = require('../utils/custom-error');

// EmailService
const sendEmail = async (to, subject, temps, vars) => {
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
  const options = {
    viewEngine: {
      extName: '.hbs', // handlebars extension
      partialsDir: path.resolve(__dirname, 'views'), // location of your subtemplates aka. header, footer etc
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, 'views'),
    extName: '.hbs',
  };
  transporter.use('compile', hbs(options));
  // Step 3
  const mailOptions = {
    from: '"Querrix" <youremail@yourdomain.com>', // TODO: email sender
    to: Array.isArray(to) ? to.join() : to, // TODO: email receiver
    subject,
    template: temps,
    context: vars,
  };

  // Step 4
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log('Error', err);
    }
    console.log('Sucess', data);
  });
};

module.exports = sendEmail;
