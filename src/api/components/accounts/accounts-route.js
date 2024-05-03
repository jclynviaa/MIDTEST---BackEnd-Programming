const express = require('express');
const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const { celebrate } = require('celebrate');
const accountsValidator = require('./accounts-validator');
const accountsController = require('./accounts-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/accounts', route);
  app.use('/authentication', route);

  // login
  route.post(
    '/login',
    celebrate(accountsValidator.login),
    accountsController.login
  );

  // create account
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(accountsValidatorValidator.create_account),
    accountsController.create_account
  );

  // get list of customers
  route.get('/', authenticationMiddleware, accountsController.get_customers);

  // get account balance
  route.get(
    '/:id',
    authenticationMiddleware,
    accountsController.get_account_by_number
  );

  // update account
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(accountsValidator.update_account),
    accountsController.update_account
  );

  // update transaction
  route.put(
    '/:transaction_id',
    authenticationMiddleware,
    celebrate(accountsValidator.update_transaction),
    accountsControllers.update_transaction
  );

  // delete account
  route.delete(
    '/:id',
    authenticationMiddleware,
    accountsController.delete_account
  );

  // delete transaction
  route.delete(
    '/:transaction_id',
    authenticationMiddleware,
    accountsController.delete_transactions
  );
};
