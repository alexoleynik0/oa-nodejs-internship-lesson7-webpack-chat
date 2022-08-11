const { default: validator } = require('../../helpers/http/validator');

const rules = {
  query: validator.string()
    .min(2).max(30),
};

const UserValidations = {
  findAll: validator.object().keys({
    query: rules.query.required(),
  }),
};

module.exports = UserValidations;
