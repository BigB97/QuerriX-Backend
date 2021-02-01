/* eslint-disable no-undef */
const app = require('express')();

/* Need to access the database to test like functionality */
const mongoose = require('mongoose');

const mongoUrl = 'mongodb://localhost/test';

let server;
const User = require('../src/models/user.model');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

// module.exports = DBManager;
module.exports = {
  setupDB(PORTS) {
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

    afterAll((done) => {
      mongoose.connection.close();
      server.close(done);
    });
  },
};
