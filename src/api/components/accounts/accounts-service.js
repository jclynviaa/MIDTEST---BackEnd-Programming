const { Account } = require('../../../models');
const { initial_deposit } = require('../../../models/accounts-schema');

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
async function get_account_by_number(id) {
  const account = await accountsRepository.get_account_by_number(id);

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
 * @param {*} customer_name
 * @param {*} customer_id
 * @param {*} customer_address
 * @param {*} customer_birthdate
 * @param {*} customer_contact
 * @param {*} initial_deposit
 * @returns
 */
async function update_account(
  customer_name,
  customer_id,
  customer_address,
  customer_birthdate,
  customer_contact,
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
