/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const personaSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    firstname: {
      type: String,
      trim: true,
      required: [true, 'Firstname is required'],
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, 'Lastname is required'],
    },
    gender: {
      type: String,
      trim: true,
      required: [true, 'Gender is required'],
    },
    profile_type: {
      type: String,
      trim: true,
      required: [true, 'Profile type is required'],
    },
    how_about: {
      type: String,
      trim: true,
      required: [true, 'Let us know how you hear about us'],
    },
    reason: {
      type: String,
      trim: true,
      required: [true, 'Main reason is required'],
    },
    uses: {
      type: String,
      trim: true,
      required: [true, 'Uses is required'],
    },
    industry: {
      type: String,
      trim: true,
      required: [true, 'Industry is required'],
    },
    industry_size: {
      type: Number,
      trim: true,
      required: [true, 'Industry size is required'],
    },
    collected_feedback: {
      type: String,
      trim: true,
      required: [true, 'have you collected feedback size is required'],
    },
    collected_feedback_platform: {
      type: String,
      trim: true,
      required: [true, 'platform used for collecting feedback is required'],
    },
    role: {
      type: String,
      trim: true,
      required: [true, 'Role is required'],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('persona', personaSchema);
