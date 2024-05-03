const accountsService = require('./accounts-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function create_account(request, response, next) {
  try {
    const customer_name = request.body.create_account;
    const customer_id = request.body.customer_id;
    const customer_contact = request.body.customer_contact;
    const account_number = request.body.account_number;
    const password = request.body.password;

    const success = await accountsService.create_account(
      customer_name,
      customer_id,
      customer_contact,
      account_number,
      initial_deposit,
      password
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create account'
      );
    }

    return response.status(200).json({ customer_name, account_number });
  } catch (error) {
    return next(error);
  }
}
