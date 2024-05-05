const accountsService = require('./accounts-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, pin } = request.body;

  try {
    // Check login credentials
    const loginSuccess = await accountsService.checkLoginCredentials(
      email,
      pin
    );

    return response.status(200).json({ loginSuccess });
  } catch (error) {
    return next(error);
  }
}

async function create_account(request, response, next) {
  try {
    const customer_name = request.body.create_account;
    const customer_id = request.body.customer_id;
    const customer_address = request.body.customer_address;
    const customer_birthdate = request.body.customer_birthdate;
    const customer_contact = request.body.customer_contact;
    const email = request.body.email;
    const pin = request.body.pin;

    const success = await accountsService.create_account(
      customer_name,
      customer_id,
      customer_address,
      customer_birthdate,
      customer_contact,
      email,
      initial_deposit,
      pin
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create account'
      );
    }

    return response.status(200).json({ id, customer_name });
  } catch (error) {
    return next(error);
  }
}

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

async function update_account(request, response, next) {
  try {
    const customer_name = request.params.customer_name;
    const customer_id = request.params.customer_id;
    const customer_address = request.params.customer_address;
    const customer_birthdate = request.params.customer_birthdate;
    const customer_contact = request.params.customer_contact;
    const initial_deposit = request.params.initial_deposit;

    const success = await accountsService.update_account(
      customer_name,
      customer_id,
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

async function change_pin(request, response, next) {
  try {
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
  login,
  create_account,
  get_customer,
  get_customers,
  update_account,
  update_transaction,
  delete_account,
  change_pin,
};
