const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const CustomError = require('../utils/custom-error');

// EmailService
const sendEmail = async (to, subject, text) => {
  // Step 1
  const auth = {
    auth: {
      api_key: 'key-ee3f01adb03d410e27afe80cfd8e2996',
      domain: 'sandbox2f108a1138d14e0196d612b9de0bbc5d.mailgun.org',
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
