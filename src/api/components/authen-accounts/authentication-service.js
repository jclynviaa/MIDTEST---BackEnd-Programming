const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorTypes, errorResponder } = require('../../../core/errors');
const accountsRepository = require('./accounts-repository');
const accountsService = require('./authentication-service');

async function login(request, response, next) {
  const { email, pin } = request.body;

  try {
    const loginResult = await accountsService.checkLoginCredentials(email, pin);

    return response.status(200).json(loginResult);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};

// authentication-service
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorTypes, errorResponder } = require('../../../core/errors');
const accountsRepository = require('./accounts-repository');

async function checkLoginCredentials(email, pin) {
  const account = await accountsRepository.get_account_by_email(email);

  const accountPassword = account
    ? account.password
    : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(pin, accountPassword);

  let loginResult = null;
  let message = ''; // Deklarasi variabel message
  if (account && passwordChecked) {
    await accountsRepository.reset_failed_login_attempts(email);

    loginResult = {
      email: account.email,
      name: account.customer_name,
      account_id: account.id,
      token: generateToken(account.email, account.id),
    };

    message = `Account ${account.email} berhasil login`;
  } else {
    await accountsRepository.update_failed_login_attempts(email);
    const attempts = await accountsRepository.get_failed_login_attempts(email);

    if (attempts >= 5) {
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

  return { message, ...loginResult };
}

module.exports = {
  checkLoginCredentials,
};

module.exports = {
  checkLoginCredentials,
};
