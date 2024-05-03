const { Account } = require('../../../models');
const { hashPassword } = require('../../../utils/password');

/**
 *
 * @param {*} customer_name
 * @param {*} customer_id
 * @param {*} customer_contact
 * @param {*} account_number
 * @param {*} initial_deposit
 * @param {*} password
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
  // hash password
  const hashedPassword = await hashPassword(password);

  try {
    await accountsRepository.create_account(
      customer_name,
      customer_id,
      customer_contact,
      account_number,
      initial_deposit,
      password
    );
  } catch (err) {
    return null;
  }
  return true;
}

/**
 *
 * @param {*} account_number
 * @returns
 */
async function get_account_by_number(account_number) {
  const account =
    await accountsRepository.get_account_by_number(account_number);

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
      account_number: account.account_number,
      customer_name: account.customer_name,
    });
  }

  return data;
}

/**
 *
 * @param {*} account_number
 * @param {*} customer_name
 * @param {*} customer_id
 * @param {*} customer_contact
 * @param {*} initial_deposit
 * @returns
 */
async function update_account(
  account_number,
  customer_name,
  customer_id,
  customer_contact,
  initial_deposit
) {
  const account =
    await accountsRepository.get_account_by_number(account_number);

  if (!account) {
    return null;
  }

  try {
    await accountsRepository.update_account(
      account_number,
      customer_name,
      customer_id,
      customer_contact,
      initial_deposit
    );
  } catch (err) {
    return null;
  }
  return true;
}

/**
 *
 * @param {*} account_number
 * @param {*} transaction_amount
 * @param {*} description
 * @returns
 */
async function update_transaction(
  account_number,
  transaction_amount,
  description
) {
  const transaction =
    await accountsRepository.get_account_by_number(account_number);

  if (!transaction) {
    return null;
  }

  try {
    await accountsRepository.update_transaction(
      account_number,
      transaction_amount,
      description
    );
  } catch (err) {
    return null;
  }
  return true;
}

/**
 *
 * @param {*} account_number
 * @returns
 */
async function delete_account(account_number) {
  return Account.deleteOne({ account_number });
}

/**
 *
 * @param {*} transaction_id
 * @returns
 */
async function delete_transactions(transaction_id) {
  return Account.findOne({ transaction_id });
}

module.exports = {
  create_account,
  get_account_by_number,
  get_customers,
  update_account,
  update_transaction,
  delete_account,
  delete_transactions,
};
