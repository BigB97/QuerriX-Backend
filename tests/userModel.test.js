/* eslint-disable no-undef */
const User = require('../src/models/user.model');
const { setupDB } = require('./testUtils');

describe('User Model test', () => {
  // BEforeall, AfterEach, Afterall
  setupDB();
  // Test start
  // Sanity Check
  it('has a USER model ', async () => {
    expect(User).toBeDefined();
  });
  // Test Creating User
  describe('Creating User', () => {
    const data = { email: 'jideola@gmail.com', password: 'Bolaji@2120' };

    it('User is receivind json data', async () => {
      const user = new User(data);
      expect(user.email).toBe(data.email);
    });

    it('Saving user info ', async () => {
      const user = new User(data);
      await user.save();
      const actual = 'jideola@gmail.com';
      const expected = user.email;
      expect(actual).toBe(expected);
    });

    it('Geting user info ', async () => {
      const findUser = await User.findOne({ email: 'jideola@gmail.com' });
      const actual = 'jideola@gmail.com';
      const expected = findUser.email;
      expect(actual).toBe(expected);
    });

    it('Updating user info ', async () => {
      const updateUser = await User.findOne({ email: 'jideola@gmail.com' });
      updateUser.email = 'bolaji@gmail.com';
      await updateUser.save();
      const actual = 'bolaji@gmail.com';
      const expected = updateUser.email;
      expect(actual).toEqual(expected);
    });
  });
});
