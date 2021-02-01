/* eslint-disable no-undef */
const app = require('express')();

/* Need to access the database to test like functionality */
const mongoose = require('mongoose');

const mongoUrl = 'mongodb://localhost/test';

const PORT = 3001;
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
  setupDB() {
    // Connect to Mongoose
    beforeAll(async () => {
      mongoose.connect(mongoUrl, options);
      mongoose.Promise = Promise;
      await User.deleteMany();
      server = app.listen(PORT);
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
