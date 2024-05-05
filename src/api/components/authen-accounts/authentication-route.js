const express = require('express');

const celebrate = require('../../../core/celebrate-wrappers');
const accountsValidator = require('./accounts-validator');
const accountsController = require('./accounts-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/accounts', route);

  // login
  route.post(
    '/login',
    celebrate(accountsValidator.login),
    accountsController.login
  );
};
