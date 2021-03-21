/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
require('dotenv').config();
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const CustomError = require('../utils/custom-error');
const sendEmail = require('./mail.service');
// const { JWT_SECRET, BCRYPT_SALT, CLIENT_URL } = process.env;
// const tokenModel = require('../models/token.model');
class AuthService {
  async RequestSignupLink(email) {
    const user = await User.findOne({ email });
    if (user) {
      throw new CustomError('Email already exist, signin or reset password');
    }
    const link = `${
      process.env.BASE_URL
    }/api/auth/signup?email=${email}&isVerified=${true}`;

    // send mail
    await sendEmail(email, 'Signup link', 'signup', { link }, (err, data) => {
      if (err) return err;
      return data;
    });
  }

  async signup(datas) {
    const {isVerified, phone, fullname, password, email } = datas;

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      password: hash,
      phone,
      email,
      fullname,
      isVerified,
    });

    await user.save();

    // Send Welcome Mail
    await sendEmail(
      email,
      'Welcome',
      'welcome',
      { name: user.fullname },
      (err, data) => {
        if (err) return err;
        return data;
      }
    );

    // Create Authentication Token
    const token = await JWT.sign(
      { id: user._id, role: user.role },
      `${process.env.JWT_SECRET}`
    );
    // Resturn User data and Auth Token
    const returnData = {
      uid: user._id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
    };
    return returnData;
  }

  async signin(data) {
    if (!data.email) throw new CustomError('Email is required');
    if (!data.password) throw new CustomError('Password is required');

    // Check if user exist
    const user = await User.findOne({ email: data.email });
    if (!user) throw new CustomError('Incorrect email or password');

    // Check if user password is correct
    const isCorrect = await bcrypt.compare(data.password, user.password);
    if (!isCorrect) throw new CustomError('Incorrect email or password');

    const token = await JWT.sign(
      { id: user._id, role: user.role },

      `${process.env.JWT_SECRET}`,

      { expiresIn: 60 * 60 }
    );

    const returnData = {
      uid: user._id,
      email: user.email,
      role: user.role,
      verified: user.isVerified,
      token,
    };
    return returnData;
  }

  async updatePassword(userId, data) {
    const user = await User.findOne({ _id: userId });
    if (!user) throw new CustomError('User dose not exist');

    // Check if user password is correct
    const isCorrect = await bcrypt.compare(data.password, user.password);
    if (!isCorrect) throw new CustomError('Incorrect password');

    const hash = await bcrypt.hash(data.password, 10);
    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
  }

  async RequestPasswordReset(email) {
    const user = await User.findOne({ email });
    if (!user) throw new CustomError('Email does not exist');

    const token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, 10);
    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${process.env.BASE_URL}/api/auth/reset-password?userId=${user._id}&resetToken=${resetToken}`;
    // send mail
    await sendEmail(email, 'Reset Password', 'reset', { link }, (err, data) => {
      if (err) return err;
      return data;
    });
  }

  async resetPassword(data) {
    const { userId, resetToken, password } = data;

    const RToken = await Token.findOne({ userId });
    if (!RToken)
      throw new CustomError('Invalid or expired password reset token');
    const isValid = await bcrypt.compare(resetToken, RToken.token);

    if (!isValid) {
      throw new CustomError('Invalid or expired password reset token');
    }
    const hash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    await RToken.deleteOne();
  }
}
module.exports = new AuthService();
