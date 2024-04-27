const { User, Timeout } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function login_attempts1(email) {
  const timeout = await Timeout.findOne({ email });

  if (!timeout) {
    await Timeout.create({ email }, { $inc: { attempts: 1 } });
  }
}

async function get_login_attempts(email) {
  const timeout = await Timeout.findOne({ email });

  if (!timeout) {
    return 0;
  }

  return timeout.attempts;
}

async function reset_login_attempts(email) {
  await Timeout.deleteOne({ email });
}

module.exports = {
  getUserByEmail,
  login_attempts1,
  get_login_attempts,
  reset_login_attempts,
};
