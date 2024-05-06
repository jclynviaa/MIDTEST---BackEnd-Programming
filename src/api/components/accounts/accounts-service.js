const { passwordMatched } = require('../../../utils/password');
const accountsRepository = require('./accounts-repository');

/**
 *
 * @returns
 */
async function get_customers() {
  const customers = await accountsRepository.get_customers();
  const data = [];
  for (let i = 0; i < customers.length; i += 1) {
    const account = customers[i];
    data.push({
      id: account.id,
      customer_name: account.customer_name,
    });
  }

  return data;
}

/**
 * Get customer by id
 * @param {*} id
 * @returns
 */
async function get_customer(id) {
  const account = await accountsRepository.get_customer(id);

  if (!account) {
    return null;
  }

  return {
    customer_name: account.customer_name,
    account_balance: account.account_balance,
  };
}

/**
 * Create account
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
  email,
  pin
) {
  if (initial_deposit < 100000) {
    return 'Failed to make a transaction, the minimum transaction is Rp100.000';
  }

  try {
    await accountsRepository.create_account({
      customer_id,
      customer_name,
      customer_address,
      customer_birthdate,
      customer_contact,
      initial_deposit,
      email,
      pin,
    });
  } catch (err) {
    return null;
  }
  return true;
}

/**
 * Update existing account
 * @param {*} customer_name
 * @param {*} customer_id
 * @param {*} customer_address
 * @param {*} customer_birthdate
 * @param {*} customer_contact
 * @param {*} email
 * @param {*} initial_deposit
 * @returns
 */
async function update_account(
  customer_id,
  customer_name,
  customer_address,
  customer_birthdate,
  customer_contact,
  email,
  initial_deposit
) {
  const account = await accountsRepository.get_account_by_number(id);

  if (!account) {
    return null;
  }

  try {
    await Account.updateOne(
      {
        id,
      },
      {
        $set: {
          customer_id,
          customer_name,
          customer_address,
          customer_birthdate,
          customer_contact,
          email,
          initial_deposit,
        },
      }
    );
  } catch (err) {
    return null;
  }
  return true;
}

/**
 * Update transaction
 * @param {*} id
 * @param {*} transaction_amount
 * @param {*} description
 * @returns
 */
async function update_transaction(id, transaction_amount, description) {
  const account = await accountsRepository.get_account_by_number(id);

  if (!account) {
    return null;
  }

  if (transaction_amount < 10000) {
    return 'Minimum transaction is Rp10.000';
  }

  // fungsi untuk menghitung saldo jika melakukan transfer
  const new_balance = account.account_balance - transaction_amount;

  // isi saldo harus mencukupi
  if (new_balance < 0) {
    return 'Your balance is not enough';
  }

  try {
    await account.save();
  } catch (err) {
    return null;
  }
  return true;
}

/**
 * Delete existing account
 * @param {*} id
 * @returns
 */
async function delete_account(id) {
  return Account.deleteOne({ _id: id });
}

/**
 * Check if there is email duplicate
 * @param {*} email
 * @returns
 */
async function email_is_registered(email) {
  const account = await accountsRepository.get_account_by_email(email);

  if (account) {
    return true;
  }

  return false;
}

/**
 * Check if there is customer_id duplicate
 * @param {*} customer_id
 * @returns
 */
async function customer_id_is_taken(customer_id) {
  const account = await accountsRepository.get_account_by_id(customer_id);

  if (account) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {*} id
 * @param {*} pin
 * @returns
 */
async function check_pin(id, pin) {
  const customer = await accountsRepository.get_customer(id);
  return passwordMatched(pin, customer.password);
}

/**
 * Change existing pin
 * @param {*} id
 * @param {*} pin
 * @returns
 */
async function change_pin(id, pin) {
  const account = await accountsRepository.get_customer(id, pin);

  if (account) {
    return true;
  }

  return false;
}

module.exports = {
  create_account,
  get_customer,
  get_customers,
  update_account,
  update_transaction,
  delete_account,
  customer_id_is_taken,
  email_is_registered,
  check_pin,
  change_pin,
};
