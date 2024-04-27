const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

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
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    if (error.type === errorTypes.TOO_MANY_FAILED_LOGIN_ATTEMPTS) {
      return response.status(403).json({
        statusCode: 403,
        error: 'TOO_MANY_FAILED_LOGIN_ATTEMPTS',
        description: 'Too many failed login attempts',
        message: 'Too many failed login attempts',
      });
    }
    return next(error);
  }
}

module.exports = {
  login,
};
