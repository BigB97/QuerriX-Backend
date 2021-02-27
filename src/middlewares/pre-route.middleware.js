const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = (app) => {
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.static('/public'));
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use('/uploads', express.static('/uploads'));

  return app;
};
