/* eslint-disable no-undef */
const app = require('express')();

/* Need to access the database to test like functionality */
const mongoose = require('mongoose');

const mongoUrl =
  'mongodb+srv://qxtest:x4uqbtfUC8lAngq9@test.s5b65.mongodb.net/test?retryWrites=true&w=majority';
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
    try {
      // Connect to Mongoose
      beforeAll(async () => {
        mongoose.connect(mongoUrl, options);
        mongoose.Promise = Promise;
        await User.deleteMany();
        server = app.listen(PORTS);
      });
      // afterEach(async () => {
      //   await User.deleteMany();
      // });

      afterAll(async (done) => {
        // await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        server.close(done);
      });
    } catch (error) {
      console.log(error);
    }
  },
};
