const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const timeoutSchema = require('./timeout-schema');
const accountsSchema = require('./accounts-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));
const Timeout = mongoose.model('timeout', timeoutSchema);
const Account = mongoose.model('accounts', mongoose.Schema(accountsSchema));

module.exports = {
  mongoose,
  User,
  Timeout,
  Account,
};
