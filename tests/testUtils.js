/* eslint-disable no-undef */
const app = require('express')();

/* Need to access the database to test like functionality */
const mongoose = require('mongoose');

const mongoUrl =
  'mongotest_url=mongodb+srv://qxtest:x4uqbtfUC8lAngq9@cluster0.s5b65.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
let server;
const User = require('../src/models/user.model');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

module.exports = {
  setupDB(PORTS) {
    // Connect to Mongoose
    beforeAll(async () => {
      mongoose.connect(mongoUrl, options);
      mongoose.Promise = Promise;
      await User.deleteMany();
      app.listen(PORTS);
    });
    // afterEach(async () => {
    //   await User.deleteMany();
    // });

    afterAll(async () => {
      await mongoose.connection.dropDatabase();
    });
  },
};
