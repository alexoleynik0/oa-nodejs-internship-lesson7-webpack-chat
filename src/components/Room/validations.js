const { default: validator, commonRules } = require('../../helpers/http/validator');

module.exports = {
  create: validator.object().keys({
    userId: commonRules.id.required(),
  }),
  findById: validator.object().keys({
    roomId: commonRules.id.required(),
  }),
};
