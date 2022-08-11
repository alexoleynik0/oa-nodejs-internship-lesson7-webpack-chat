const { default: validator, commonRules } = require('../../helpers/http/validator');

const RoomValidations = {
  create: validator.object().keys({
    userId: commonRules.id.required(),
  }),
  findById: validator.object().keys({
    roomId: commonRules.id.required(),
  }),
};

module.exports = RoomValidations;
