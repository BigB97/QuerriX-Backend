/* eslint-disable no-undef */
const app = require('express')();

/* Need to access the database to test like functionality */
const mongoose = require('mongoose');

let server;
const User = require('../models/user.model');

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
        mongoose.connect(process.env.mongoUrlTest, options);
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
