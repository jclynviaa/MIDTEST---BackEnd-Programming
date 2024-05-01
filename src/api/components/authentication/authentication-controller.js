const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const authenticationRepository = require('./authentication-repository');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      const attempts =
        await authenticationRepository.get_failed_login_attempts(email);
      const message = `Wrong email or password, failed to login, attempt: ${attempts}`;
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, message);
    }

    return response
      .status(200)
      .json({ message: `User ${email} berhasil login` });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
