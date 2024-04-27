const mongoose = require('mongoose');

const timeoutSchema = new mongoose.Schema({
  email: String,
  attempts: { type: Number, default: 0 },
});

module.exports = timeoutSchema;
