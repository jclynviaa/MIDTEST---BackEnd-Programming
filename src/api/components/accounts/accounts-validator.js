const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  login: {
    body: {
      email: joi.string().email().required().label('Email'),
      pin: joi.string().required().label('Pin'),
    },
  },

  create_account: {
    body: {
      customer_id: joi.string().min(1).max(100).required().label('Id'),
      customer_name: joi.string().min(1).max(100).required().label('Name'),
      customer_address: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Address'),
      customer_contact: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Contact Number'),
      customer_birthdate: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Birth Date'),
      initial_deposit: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Initial Deposit'),
      email: joi.string().email().min(1).max(100).required().label('Email'),
      pin: joiPassword
        .string()
        .min(1)
        .max(100)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .required()
        .label('Pin'),
    },
  },

  update_account: {
    body: {
      customer_id: joi.string().min(1).max(100).required().label('Id'),
      customer_name: joi.string().min(1).max(100).required().label('Name'),
      customer_address: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Address'),
      customer_contact: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Contact Number'),
      customer_birthdate: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Birth Date'),
      initial_deposit: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Initial Deposit'),
      email: joi.string().email().min(1).max(100).required().label('Email'),
    },
  },

  update_transaction: {
    body: {
      transaction_amount: joi.string().required().label('Transaction Amount'),
      description: joi.string().min(1).max(100).required().label('Description'),
    },
  },

  change_pin: {
    body: {
      pin_old: joi.string().required().label('Old pin'),
      pin_new: joiPassword
        .string()
        .min(1)
        .max(100)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .required()
        .label('New pin'),
    },
  },
};
