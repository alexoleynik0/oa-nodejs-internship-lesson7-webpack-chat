const Joi = require('joi');
const { Types } = require('mongoose');

const validator = Joi.extend({
  type: 'db',
  base: Joi.string(),
  messages: {
    'db.objectId.base': '{{#label}} must be a single String of 12 bytes or a string of 24 hex characters',
    'db.unique.base': '{{#label}} is already taken',
  },
  rules: {
    objectId: {
      method() {
        return this.$_addRule({ name: 'objectId' });
      },
      validate(value, helpers) {
        if (!Types.ObjectId.isValid(value)) {
          return helpers.error('db.objectId.base');
        }
        return value;
      },
    },
    unique: {
      method(serviceMethod, filter) {
        return this.$_addRule({ name: 'unique', args: { serviceMethod, filter } });
      },
      args: [
        {
          name: 'serviceMethod',
          ref: false,
          assert: (value) => typeof value === 'function',
          message: 'must be a function',
        },
        {
          name: 'filter',
          ref: false,
          assert: (value) => typeof value === 'object',
          message: 'must be an filter object',
        },
      ],
      async validate(value, helpers, args) {
        const preparedFilter = {};
        Object.keys(args.filter).forEach((key) => {
          preparedFilter[key] = args.filter[key] === '{{value}}' ? value : args.filter[key];
        });
        const exists = await args.serviceMethod(preparedFilter);
        if (exists) {
          return helpers.error('db.unique.base');
        }
        return value;
      },
    },
  },
});

const commonRules = {
  id: validator.db().objectId(),
  optional: validator.optional(),
};

module.exports = {
  default: validator,
  commonRules,
};
