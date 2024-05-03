const { Account } = require('../../../models');

/**
 *
 * @param {*} customer_name
 * @param {*} customer_id
 * @param {*} customer_address
 * @param {*} customer_birthdate
 * @param {*} customer_contact
 * @param {*} initial_deposit
 * @param {*} pin
 * @returns
 */
async function create_account(
  customer_name,
  customer_id,
  customer_address,
  customer_birthdate,
  customer_contact,
  initial_deposit,
  pin
) {
  return Account.create({
    customer_name,
    customer_id,
    customer_address,
    customer_birthdate,
    customer_contact,
    initial_deposit,
    pin,
  });
}

/**
 * Get account by account number
 * @param {*} id
 * @returns
 */
async function get_account_by_number(id) {
  return Account.findOne({ _id: id });
}

/**
 *
 * @param {*} customer_id
 * @returns
 */
async function get_account_by_id(customer_id) {
  return Account.findOne({ customer_id });
}

/**
 * 
 * @param {*} email 
 * @returns 
 */
async function get_account_by_email(email) {
  return Account.findOne({ email });
}

/**
 * Get list of customers
 * @param {*}
 * @returns
 */
async function get_customers() {
  return customers;
}

/**
 *
 * @param {*} id
 * @param {*} customer_name
 * @param {*} customer_id
 * @param {*} customer_contact
 * @param {*} initial_deposit
 * @returns
 */
async function update_account(
  id,
  customer_name,
  customer_id,
  customer_address,
  customer_birthdate,
  customer_contact,
  initial_deposit
) {
  return Account.updateOne(
    {
      id,
    },
    {
      $set: {
        account_number,
        customer_name,
        customer_id,
        customer_address,
        customer_birthdate,
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
async function update_transaction(
  id,
  transaction_id,
  transaction_amount,
  description
) {
  return Account.updateOne(
    {
      id,
    },
    {
      $set: {
        transaction_id,
        transaction_amount,
        description,
      },
    }
  );
}

async function delete_account(id) {
  return User.deleteOne({ _id: id });
}

async function delete_transactions(transaction_id) {
  return User.deleteOne({ transaction_id });
}

module.exports = {
  create_account,
  get_account_by_number,
  get_customers,
  get_account_by_email,
  get_account_by_id,
  update_account,
  update_transaction,
  delete_account,
  delete_transactions,
};
