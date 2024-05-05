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
  const accountPassword = account
    ? account.password
    : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(pin, accountPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  let loginResult = null;
  if (account && passwordChecked) {
    // Reset failed login attempts if login is successful
    await accountsRepository.reset_failed_login_attempts(email);

    loginResult = {
      email: account.email,
      name: account.customer_name,
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

module.exports = {
  checkLoginCredentials,
};
