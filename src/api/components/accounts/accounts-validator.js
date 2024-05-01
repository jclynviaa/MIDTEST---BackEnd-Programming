const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  create_account: {
    body: {
      customer_name: joi.string().min(1).max(100).required().label('Name'),
      customer_id: joi.number().min(10).max(10).id().required().label('Id'),
      customer_contact: joi
        .number()
        .min(12)
        .max(12)
        .required()
        .label('Contact Number'),
      initial_deposit: joi.number().required().label('Initial Deposit'),
      account_number: joi.number().required().label('Account Number'),
      password: joiPassword
        .string()
        .min(5)
        .max(10)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfSpecialCharacters(1)
        .required()
        .label('Password'),
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
      initial_deposit: joi.number().required().label('Initial Deposit'),
    },
  },
};
