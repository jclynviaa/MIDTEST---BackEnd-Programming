const { Account } = require('../../../models');
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
 *
 * @param {*} account_number - Account Number
 * @returns
 */
async function get_account(account_number) {
  return Account.findOne({ account_number });
}

async function update_account() {
  return Account.updateOne({});
}

async function delete_account() {}

module.exports = {
  create_account,
  get_account_by_number,
  get_account,
  update_account,
  delete_account,
};
