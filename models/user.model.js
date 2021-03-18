/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const { BCRYPT_SALT } = require('../config');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Email is required'],
    },
    fullname: {
      type: String,
      trim: true,
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      trim: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('users', userSchema);
