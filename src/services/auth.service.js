/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const CustomError = require('../utils/custom-error');

class AuthService {
  async signup(data) {
    let user = await User.findOne({ email: data.email });
    if (user) throw new CustomError('Email already exists');

    user = new User(data);
    const token = JWT.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    await user.save();

    const returnData = {
      uid: user._id,
      email: user.email,
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
      'JWT_SECRET',
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

    const hash = await bcrypt.hash(
      data.password,
      process.env.process.env.BCRYPT_SALT
    );

    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
  }

  async RequestEmailVerification(email) {
    const user = await User.findOne({ email });
    if (!user) throw new CustomError('Email does not exist');
    if (user.isVerified) throw new CustomError('Email is already verified');

    const token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(verifyToken, process.env.BCRYPT_SALT);

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${proccess.env.CLIENT_URL}/email-verification?uid=${user._id}&verifyToken=${verifyToken}`;

    // send Mail
    return link;
  }

  async VerifyEmail(data) {
    const { userId, verifyToken } = data;

    const user = await User.findOne({ _id: userId });
    if (!user) throw new CustomError('User does not exist');
    if (user.isVerified) throw new CustomError('Email is already verified');

    const VToken = await Token.findOne({ userId });
    if (!VToken)
      throw new CustomError('Invalid or expired password reset token');

    const isValid = await bcrypt.compare(verifyToken, VToken.token);
    if (!isValid)
      throw new CustomError('Invalid or expired password reset token');

    await User.updateOne(
      { _id: userId },
      { $set: { isVerified: true } },
      { new: true }
    );

    await VToken.deleteOne();
  }

  async RequestPasswordReset(email) {
    const user = await User.findOne({ email });
    if (!user) throw new CustomError('Email does not exist');

    const token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, process.env.BCRYPT_SALT);

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${proccess.env.CLIENT_}/reset-password?uid=${user._id}&resetToken=${resetToken}`;

    // send mail
    return link;
  }

  async resetPassword(data) {
    const { userId, resetToken, password } = data;

    const RToken = await Token.findOne({ userId });
    if (!RToken)
      throw new CustomError('Invalid or expired password reset token');

    const isValid = await bcrypt.compare(resetToken, RToken.token);
    if (!isValid)
      throw new CustomError('Invalid or expired password reset token');

    const hash = await bcrypt.hash(password, process.env.BCRYPT_SALT);

    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    await RToken.deleteOne();
  }
}

module.exports = new AuthService();
