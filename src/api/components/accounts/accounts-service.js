const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorTypes, errorResponder } = require('../../../core/errors');
const accountsRepository = require('./accounts-repository');

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} pin - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, pin) {
  const account = await accountsRepository.get_account_by_email(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = account ? account.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(pin, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  let loginResult = null;
  if (account && passwordChecked) {
    // Reset failed login attempts if login is successful
    await accountsRepository.reset_failed_login_attempts(email);

    loginResult = {
      email: account.email,
      name: account.name,
      account_id: account.id,
      token: generateToken(account.email, account.id),
    };
  } else {
    // Update failed login attempts
    await accountsRepository.update_failed_login_attempts(email);
    // Get the number of failed login attempts
    const attempts = await accountsRepository.get_failed_login_attempts(email);

    // Check if attempts exceed the limit
    if (attempts >= 5) {
      // If exceeded, throw an error indicating too many failed attempts
      throw errorResponder(
        errorTypes.TOO_MANY_FAILED_LOGIN_ATTEMPTS,
        'Too many failed login attempts, try again in 30 minutes'
      );
    } else {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS_ERROR,
        `Wrong email or pin, fail to login, attempt : ${attempts + 1}`
      );
    }
  }

  if (loginResult) {
    message = `Account ${account.email} berhasil login`;
  }
  return message;
}

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
  email,
  initial_deposit,
  pin
) {
  if (initial_deposit < 100000) {
    return 'Failed to make a transaction, the minimum transaction is Rp100.000';
  }

  try {
    await accountsRepository.create_account({
      customer_name,
      customer_id,
      customer_address,
      customer_birthdate,
      customer_contact,
      email,
      account_balance: initial_deposit,
      pin,
    });
  } catch (err) {
    return null;
  }
  return true;
}

/**
 *
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
 *
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
  customer_name,
  customer_id,
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
          customer_name,
          customer_id,
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
 *
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

  const new_balance = account.account_balance - transaction_amount;
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
 *
 * @param {*} id
 * @returns
 */
async function delete_account(id) {
  return Account.deleteOne({ _id: id });
}

/**
 *
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
 *
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
  checkLoginCredentials,
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
