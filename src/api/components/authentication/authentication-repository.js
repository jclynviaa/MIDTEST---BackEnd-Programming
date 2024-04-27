const { User, Timeout } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * update failed login attempts
 * @param {string} email
 */
async function login_attempts1(email) {
  const timeout = await Timeout.findOne({ email });

  if (!timeout) {
    await Timeout.create({ email, attempts: 1 });
  } else {
    await Timeout.updateOne({ email }, { $inc: { attempts: 1 } });
  }
}

/**
 * get the number of failed login attempts
 * @param {string} email
 * @returns
 */

async function get_login_attempts(email) {
  const timeout = await Timeout.findOne({ email });

  if (!timeout) {
    return 0;
  }

  return timeout.attempts;
}

/**
 * reset failed login attempts
 * @param {string} email
 */
async function reset_login_attempts(email) {
  await Timeout.deleteOne({ email });
}

module.exports = {
  getUserByEmail,
  login_attempts1,
  get_login_attempts,
  reset_login_attempts,
};
