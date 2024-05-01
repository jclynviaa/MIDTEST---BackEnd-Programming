const { User, Timeout } = require('../../../models');
const login_timeout = 2 * 60 * 1000;

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
async function update_failed_login_attempts(email) {
  const timeout = await Timeout.findOneAndUpdate(
    { email },
    { $inc: { attempts: 1 }, last_attempt: Date.now() },
    { upsert: true, new: true }
  );

  if (Date.now() - timeout.last_attempt > login_timeout) {
    await reset_failed_login_attempts(email);
  }
}

/**
 * get the number of failed login attempts
 * @param {string} email
 * @returns
 */

async function get_failed_login_attempts(email) {
  const timeout = await Timeout.findOne({ email });
  if (timeout && Date.now() - timeout.last_attempt > login_timeout) {
    await reset_failed_login_attempts(email);
    return 0;
  }
  return timeout ? timeout.attempts : 0;
}

/**
 * reset failed login attempts
 * @param {string} email
 */
async function reset_failed_login_attempts(email) {
  await Timeout.findOneAndUpdate(
    { email },
    { attempts: 0, last_attempt: null },
    { upsert: true }
  );
}

module.exports = {
  getUserByEmail,
  update_failed_login_attempts,
  get_failed_login_attempts,
  reset_failed_login_attempts,
};
