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
      customer_name: joi.string().min(1).max(100).required().label('Name'),
      customer_id: joi.number().min(10).max(10).required().label('Id'),
      customer_address: joi.string().required().label('Address'),
      customer_contact: joi
        .number()
        .min(12)
        .max(12)
        .required()
        .label('Contact Number'),
      customer_birthdate: joi.string().required().label('Birth Date'),
      email: joi.string().email().required().label('Email'),
      initial_deposit: joi.number().required().label('Initial Deposit'),
      pin: joiPassword
        .string()
        .min(5)
        .max(10)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .required()
        .label('Pin'),
    },
  },

  update_account: {
    body: {
      customer_name: joi.string().min(1).max(100).required().label('Name'),
      customer_id: joi.number().min(10).max(10).id().required().label('Id'),
      customer_contact: joi
        .number()
        .min(12)
        .max(12)
        .required()
        .label('Contact Number'),
      customer_address: joi.string().required().label('Address'),
      customer_contact: joi
        .number()
        .min(12)
        .max(12)
        .required()
        .label('Contact Number'),
      customer_birthdate: joi.string().required().label('Birth Date'),
      email: joi.string().email().required().label('Email'),
    },
  },

  update_transaction: {
    body: {
      transaction_id: joi.string().required().label('Transaction Id'),
      transaction_amount: joi.number().required().label('Transaction Amount'),
      description: joi
        .string()
        .min(1)
        .max(15)
        .maxOfSpecialCharacters(0)
        .required()
        .label('Description'),
    },
  },
};
