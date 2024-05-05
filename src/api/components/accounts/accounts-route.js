const express = require('express');
const accountAuthentication = require('../../middlewares/account-authentication');
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

  // create account
  route.post(
    '/',
    accountAuthentication,
    celebrate(accountsValidator.create_account),
    accountsController.create_account
  );

  // get list of customers
  route.get('/', accountAuthentication, accountsController.get_customers);

  // get account balance
  route.get('/:id', accountAuthentication, accountsController.get_customer);

  // update account
  route.put(
    '/:id',
    accountAuthentication,
    celebrate(accountsValidator.update_account),
    accountsController.update_account
  );

  // update transaction
  route.patch(
    '/:id',
    accountAuthentication,
    celebrate(accountsValidator.update_transaction),
    accountsController.update_transaction
  );

  // delete account
  route.delete(
    '/:id',
    accountAuthentication,
    accountsController.delete_account
  );

  // change pin
  route.post(
    '/:id/change-pin',
    accountAuthentication,
    celebrate(accountsValidator.change_pin),
    accountsController.change_pin
  );
};
