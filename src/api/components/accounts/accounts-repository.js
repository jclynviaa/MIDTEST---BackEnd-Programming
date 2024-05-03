const { Account, User } = require('../../../models');
const { account_number } = require('../../../models/accounts-schema');
const accountsValidator = require('./accounts-validator');

/**
 * Create new Account
 * @param {*} customer_name - Customer's Name
 * @param {*} customer_id - Customer' id
 * @param {*} customer_contact - Customer's Contact Number
 * @param {*} account_number - Account Number
 * @param {*} initial_deposit - Deposit
 * @param {*} password - Hashed password
 * @returns
 */
async function create_account(
  customer_name,
  customer_id,
  customer_contact,
  account_number,
  initial_deposit,
  password
) {
  return Account.create({
    customer_name,
    customer_id,
    customer_contact,
    account_number,
    initial_deposit,
    password,
  });
}

/**
 * Get account by account number
 * @param {*} account_number - Account Number
 * @returns
 */
async function get_account_by_number(account_number) {
  return Account.findOne({ account_number });
}

/**
 * Get list of customers
 * @param {*} account_number - Account Number
 * @returns
 */
async function get_customers() {
  return customers;
}

/**
 *
 * @param {*} id
 * @param {*} account_number
 * @param {*} customer_name
 * @param {*} customer_id
 * @param {*} customer_contact
 * @param {*} initial_deposit
 * @returns
 */
async function update_account(
  id,
  account_number,
  customer_name,
  customer_id,
  customer_contact,
  initial_deposit
) {
  return Account.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        account_number,
        customer_name,
        customer_id,
        customer_contact,
        initial_deposit,
      },
    }
  );
}

/**
 *
 * @param {*} id
 * @param {*} transaction_amount
 * @param {*} description
 * @returns
 */
async function update_transactions(id, transaction_amount, description) {
  return Account.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        transaction_amount,
        description,
      },
    }
  );
}

/**
 *
 * @param {*} id
 * @param {*} account_number
 * @returns
 */
async function update_balance(id, account_number) {
  return Account.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        account_number,
      },
    }
  );
}

async function delete_account(account_number) {
  return User.deleteOne({ account_number });
}

async function delete_transactions(transaction_id) {
  return User.deleteOne({ transaction_id });
}

module.exports = {
  create_account,
  get_account_by_number,
  get_customers,
  update_account,
  update_transactions,
  update_balance,
  delete_account,
  delete_transactions,
};
