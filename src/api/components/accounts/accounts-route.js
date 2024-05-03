const express = require('express');
const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const { celebrate } = require('celebrate');
const usersValidator = require('../users/users-validator');
const accountsValidator = require('./accounts-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/accounts', route);

  // create account
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(usersValidator.create_account),
    accountsControllers.create_account
  );

  // get list of customers
  route.get('/', authenticationMiddleware, accountsControllers.get_customers);

  // get account balance
  route.get(
    '/:id',
    authenticationMiddleware,
    accountsControllers.get_account_by_number
  );

  // update account
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(accountsValidator.update_account),
    accountsControllers.update_account
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
    accountsControllers.delete_account
  );

  // delete transaction
  route.delete(
    '/:transaction_id',
    authenticationMiddleware,
    accountsControllers.delete_transactions
  );
};
