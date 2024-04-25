const { split } = require('lodash');
const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers(page_n, page_s, sort, search) {
  const search1 = search.split(':');
  const search2 = search1[1];

  const sortS = sort.split(':');
  const sortBy = sortS[0];
  const sortOrder = sortS[1] || 'asc';

  let query = {};
  switch (search1[0]) {
    case 'name':
      query = { name: { $regex: search2 } };
      break;

    case 'email':
      query = { email: { $regex: search2 } };
      break;

    default:
      query = {};
      break;
  }

  const users = await User.find(query)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(page_n * page_s)
    .limit(page_s);

  return users;
}

async function countUsers(search) {
  const search1 = search.split(':');
  const search2 = search1[1];

  let query = {};
  switch (search1[0]) {
    case 'name':
      query = { name: { $regex: search2 } };
      break;

    case 'email':
      query = { email: { $regex: search2 } };
      break;

    default:
      query = {};
      break;
  }

  const count = await User.countDocuments(query);
  return count;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  countUsers,
};
