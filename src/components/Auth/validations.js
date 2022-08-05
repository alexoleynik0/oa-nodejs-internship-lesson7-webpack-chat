const { default: validator, commonRules } = require('../../helpers/http/validator');
const UserService = require('../User/service');

const rules = {
  nicknameUnique: validator.db()
    .unique(UserService.exists, { nickname: '{{value}}' }),

  nickname: validator.string()
    .min(4).max(30)
    .pattern(/^\w+$/, { name: 'alpha' }),

  password: validator.string()
    .length(4)
    .pattern(/^\d+$/, { name: 'numbers' })
    .rule({ message: '"password" must contain only 0-9 digits' }),

  fullName: validator.string()
    .min(2).max(100),

  photoUrl: validator.string(),

  refreshToken: validator.string(),
};

module.exports = {
  create: validator.object().keys({
    nickname: rules.nickname.required(),
    password: rules.password.required(),
  }),
  createAsync: validator.object().keys({
    nickname: rules.nicknameUnique.required(),
    password: commonRules.optional,
  }),
  refreshToken: validator.object().keys({
    userId: commonRules.id.required(),
    oldRefreshToken: rules.refreshToken.required(),
  }),
};
