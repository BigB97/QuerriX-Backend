/* eslint-disable no-console */
const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

module.exports = async (URL) => {
  try {
    await mongoose.connect(URL, options);
    console.log(':::> Connected to MongoDB database');
  } catch (error) {
    console.log("<::: Couldn't connect to database ", error);
  }
};
