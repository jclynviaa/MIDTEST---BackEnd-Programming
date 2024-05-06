const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers(page_n, page_s, search, sort) {
  let query = {};
  var search1 = search.split(':'); // split : mendapatkan jenis pencarian dan nilai pencariannya

  const sortBy = {};
  sort = sort.split(':');
  sortBy[sort[0]] = sort[1];

  switch (search1[0]) {
    case 'name':
      query = { name: { $regex: search1[1] } }; // $regex untuk mencocokkan nilai pencarian
      break;

    case 'email':
      query = { email: { $regex: search1[1] } };
      break;

    default:
      query = {};
      break;
  }

  const users = await User.find(query) // data user yang cocok dengan query tersebut diambil dari database menggunakan metode find()
    .sort(sortBy)
    .skip(page_n * page_s)
    .limit(page_s);

  return users;
}

async function getUserCount(page_n, page_s, search) {
  let query = {};
  var search1 = search.split(':');

  switch (search1[0]) {
    case 'name':
      query = { name: { $regex: search1[1] } }; // $regex untuk mencocokkan nilai pencarian
      break;

    case 'email':
      query = { email: { $regex: search1[1] } };
      break;

    default:
      query = {};
      break;
  }
  const count = await User.countDocuments(query); // jumlah data pengguna yang cocok dengan query pencarian dihitung menggunakan fungsi countDocuments()
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
  getUserCount,
};
