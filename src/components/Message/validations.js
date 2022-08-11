const { default: validator, commonRules } = require('../../helpers/http/validator');

const MessageValidations = {
  create: validator.object().keys({
    roomId: commonRules.id.required(),
    text: validator.string()
      .min(1).max(10000)
      .required(),
  }),
  findAllByRoomId: validator.object().keys({
    roomId: commonRules.id.required(),
  }),
};

module.exports = MessageValidations;
