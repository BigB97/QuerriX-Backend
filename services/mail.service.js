const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const CustomError = require('../utils/custom-error');

// EmailService
const sendEmail = async (to, subject, text) => {
  // Step 1
  const auth = {
    auth: {
      api_key: process.env.MAILER_KEY,
      domain: process.env.MAILER_DOMAIN,
    },
  };

  // Step 2
  const transporter = nodemailer.createTransport(mailGun(auth));

  // Step 3
  const mailOptions = {
    from: '"Querrix" <youremail@yourdomain.com>', // TODO: email sender
    to: Array.isArray(to) ? to.join() : to, // TODO: email receiver
    subject,
    text,
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
