const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorTypes } = require('../../../core/errors');

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const failed_login_attempts = {};

  if (
    failed_login_attempts[email] &&
    failed_login_attempts[email].attempts >= 5
  ) {
    throw errorResponder(
      errorTypes.TOO_MANY_FAILED_LOGIN_ATTEMPTS,
      'Too many failed login attempts'
    );
  }

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
  if (user && passwordChecked) {
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else {
    if (!failed_login_attempts[email]) {
      failed_login_attempts[email] = { attempts: 1, last_attempt: Date.now() };
    } else {
      failed_login_attempts[email].attempts++;
    }
    return null;
  }
}

async function resetfailed_login_attempts(email) {
  if (failed_login_attempts[email]) delete failed_login_attempts[email];
}

module.exports = {
  checkLoginCredentials,
  resetfailed_login_attempts,
};
