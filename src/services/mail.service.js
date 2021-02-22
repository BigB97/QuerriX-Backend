const nodemailer = require('nodemailer');
const CustomError = require('../utils/custom-error');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORT,
      secure: process.env.SECURE,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });
  }

  async send(from, to, subject, content) {
    from = from || `${process.env.APP_NAME} <no-reply${process.env.DOMAIN}>`;
    content = content || 'Hello world';

    if (!to) throw new CustomError('Recipient is required');
    if (!subject) throw new CustomError('Subject is required');

    const sent = await this.transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join() : to,
      subject,
      text: content,
    });
  }
}

module.exports = MailService;
