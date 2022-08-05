const { default: validator } = require('../../helpers/http/validator');

const rules = {
  query: validator.string()
    .min(2).max(30),
};

module.exports = {
  findAll: validator.object().keys({
    query: rules.query.required(),
  }),
};
