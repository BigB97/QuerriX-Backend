/* eslint-disable class-methods-use-this */
/* eslint-disable no-return-await */
const User = require('../models/user.model');
const Persona = require('../models/userPersona');
const CustomError = require('../utils/custom-error');

class UserService {
  async create(data) {
    return await new User(data).save();
  }

  async getAll() {
    return await User.find({}, { password: 0, __v: 0 });
  }

  async getOne(userId) {
    const user = await User.findOne({ _id: userId }, { password: 0, __v: 0 });
    if (!user) throw new CustomError('User does not exists');

    return user;
  }

  async update(userId, data) {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: data },
      { new: true }
    );

    if (!user) throw new CustomError("User dosen't exist", 404);

    return user;
  }

  async delete(userId) {
    const user = await User.findOne({ _id: userId });
    user.remove();
    return user;
  }

  async userPersona(users, data) {
    const persona = await Persona.create({
      userId: users._id,
      firstname: data.firstname,
      // lastname: data.lastname,
      gender: data.gender,
      profile_type: data.profile_type,
      how_about: data.how_about,
      reason: data.reason,
      uses: data.uses,
      industry: data.industry,
      industry_size: data.industry_size,
      role: data.role,
      collected_feedback: data.collected_feedback,
      collected_feedback_platform: data.collected_feedback_platform,
    });
    
     await User.findByIdAndUpdate(
      { _id: users._id},
      { $set: { isUnboarding: true } },
      { new: true }
    );
    
    return persona;
  }
}

module.exports = new UserService();
