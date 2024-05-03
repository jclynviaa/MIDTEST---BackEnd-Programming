const { Account } = require('../../../models');
const { User, Timeout } = require('../../../models');
const login_timeout = 30 * 60 * 1000;

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function get_account_by_email(email) {
  return User.findOne({ email });
}

/**
 * update failed login attempts
 * @param {string} email
 */
async function update_failed_login_attempts(email) {
  const timeout = await Timeout.findOneAndUpdate(
    { email },
    { $inc: { attempts: 1 }, last_attempt: Date.now() },
    { upsert: true, new: true }
  );

  if (timeout && Date.now() - timeout.last_attempt > login_timeout) {
    await reset_failed_login_attempts(email);
  }
}

/**
 * get the number of failed login attempts
 * @param {string} email
 * @returns
 */

async function get_failed_login_attempts(email) {
  const timeout = await Timeout.findOne({ email });
  if (timeout && Date.now() - timeout.last_attempt > login_timeout) {
    await reset_failed_login_attempts(email);
    return 0;
  }
  return timeout ? timeout.attempts : 0;
}

/**
 * reset failed login attempts
 * @param {string} email
 */
async function reset_failed_login_attempts(email) {
  await Timeout.findOneAndUpdate(
    { email },
    { attempts: 0, last_attempt: null },
    { upsert: true }
  );
}

module.exports = {
  get_account_by_email,
  update_failed_login_attempts,
  get_failed_login_attempts,
  reset_failed_login_attempts,
};

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
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function get_customer(id) {
  return User.findById(id);
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
  get_customer,
  get_customers,
  get_account_by_email,
  get_account_by_id,
  update_account,
  update_transaction,
  delete_account,
  delete_transactions,
};
