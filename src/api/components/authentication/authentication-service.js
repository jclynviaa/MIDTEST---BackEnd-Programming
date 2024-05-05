const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorTypes, errorResponder } = require('../../../core/errors');

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  let loginResult = null;
  let message = ''; // Inisialisasi message di sini
  if (user && passwordChecked) {
    // Reset failed login attempts if login is successful
    await authenticationRepository.reset_failed_login_attempts(email);

    loginResult = {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else {
    // Update failed login attempts
    await authenticationRepository.update_failed_login_attempts(email);
    // Get the number of failed login attempts
    const attempts =
      await authenticationRepository.get_failed_login_attempts(email);

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
        `Wrong email or password, fail to login, attempt : ${attempts + 1}`
      );
    }
  }

  if (loginResult) {
    message = `User ${user.email} berhasil login`;
  }
  return { message, ...loginResult };
}

module.exports = {
  checkLoginCredentials,
};
