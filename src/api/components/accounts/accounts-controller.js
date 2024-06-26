const accountsService = require('./accounts-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Get detail of an account
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
async function get_customer(request, response, next) {
  try {
    const account = await accountsService.get_customer(request.params.id);

    if (!account) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown Account');
    }

    return response.status(200).json(account);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get list of customers
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
async function get_customers(request, response, next) {
  try {
    const customers = await accountsService.get_customers();

    if (!customers) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to get List Customers'
      );
    }
    return response.status(200).json(customers);
  } catch (error) {
    return next(error);
  }
}

/**
 * Create account
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
async function create_account(request, response, next) {
  try {
    const customer_id = request.body.customer_id;
    const customer_name = request.body.customer_name;
    const customer_address = request.body.customer_address;
    const customer_birthdate = request.body.customer_birthdate;
    const customer_contact = request.body.customer_contact;
    const initial_deposit = request.body.initial_deposit;
    const email = request.body.email;
    const pin = request.body.pin;

    const success = await accountsService.create_account(
      customer_id,
      customer_name,
      customer_address,
      customer_birthdate,
      customer_contact,
      initial_deposit,
      email,
      pin
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create account'
      );
    }

    return response.status(200).json({
      customer_id,
      customer_name,
      customer_address,
      customer_birthdate,
      customer_contact,
      initial_deposit,
      email,
      pin,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update account
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
async function update_account(request, response, next) {
  try {
    const customer_id = request.params.customer_id;
    const customer_name = request.params.customer_name;
    const customer_address = request.params.customer_address;
    const customer_birthdate = request.params.customer_birthdate;
    const customer_contact = request.params.customer_contact;
    const initial_deposit = request.params.initial_deposit;

    const success = await accountsService.update_account(
      customer_id,
      customer_name,
      customer_address,
      customer_birthdate,
      customer_contact,
      initial_deposit
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update transaction
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
async function update_transaction(request, response, next) {
  try {
    const id = request.params.id;
    const transaction_amount = request.params.transaction_amount;
    const description = request.params.description;

    const success = await accountsService.update_transaction(
      id,
      transaction_amount,
      description
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to do transaction'
      );
    }

    const message = 'Successful transaction';
    return response.status(200).json({ message });
  } catch (error) {
    return next(error);
  }
}

/**
 * Delete account
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
async function delete_account(request, response, next) {
  try {
    const id = request.params.id;

    const success = await accountsService.delete_account(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete account'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Change existing pin
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
async function change_pin(request, response, next) {
  try {
    // check if the pin is correct
    if (
      !(await accountsService.check_pin(
        request.params.id,
        request.body.pin_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong Pin');
    }

    const changeSuccess = await accountsService.change_pin(
      request.params.id,
      request.body.pin_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change pin'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create_account,
  get_customer,
  get_customers,
  update_account,
  update_transaction,
  delete_account,
  change_pin,
};
