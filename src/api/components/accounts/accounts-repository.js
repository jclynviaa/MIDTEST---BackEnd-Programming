/**
 * Get user by customer_id to prevent duplicate customer_id
 * @param {*} customer_id
 * @returns
 */
async function get_account_by_id(customer_id) {
  return Account.findOne({ customer_id });
}

/**
 * Get user by email to prevent duplicate email
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
  return Account.find();
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function get_customer(id) {
  return Account.findById(id);
}

/**
 *
 * @param {*} customer_id
 * @param {*} customer_name
 * @param {*} customer_address
 * @param {*} customer_birthdate
 * @param {*} customer_contact
 * @param {*} initial_deposit
 * @param {*} email
 * @param {*} pin
 * @returns
 */
async function create_account(
  customer_id,
  customer_name,
  customer_address,
  customer_birthdate,
  customer_contact,
  initial_deposit,
  email,
  pin
) {
  return Account.create({
    customer_id,
    customer_name,
    customer_address,
    customer_birthdate,
    customer_contact,
    initial_deposit,
    email,
    pin,
  });
}

/**
 * Update existing account
 * @param {*} id
 * @param {*} customer_name
 * @param {*} customer_id
 * @param {*} customer_contact
 * @param {*} initial_deposit
 * @returns
 */
async function update_account(
  id,
  customer_id,
  customer_name,
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
        customer_id,
        customer_name,
        customer_address,
        customer_birthdate,
        customer_contact,
        initial_deposit,
      },
    }
  );
}

/**
 * Update transaction
 * @param {*} id
 * @param {*} transaction_amount
 * @param {*} description
 * @returns
 */
async function update_transaction(id, transaction_amount, description) {
  return Account.updateOne(
    {
      id,
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
 * Delete account
 * @param {*} id
 * @returns
 */
async function delete_account(id) {
  return Account.deleteOne({ _id: id });
}

module.exports = {
  update_failed_login_attempts,
  get_failed_login_attempts,
  reset_failed_login_attempts,
  create_account,
  get_customer,
  get_customers,
  get_account_by_email,
  get_account_by_id,
  update_account,
  update_transaction,
  delete_account,
};
