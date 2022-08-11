const ValidationError = require('../error/ValidationError');

const DEFAULT_VALIDATION_OPTIONS = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false,
};

// specific for Joi errors
const helpersErrorToErrorDetails = (details, helpersError) => {
  details.push({
    message: helpersError.messages[helpersError.code].source.replace(/{{#label}}/g, `"${helpersError.local.label}"`),
    type: helpersError.code,
    path: helpersError.path,
    context: helpersError.local,
  });
};

const resolveAsyncRules = async (value) => {
  // collect all pending rule promises (see extended validator)
  const promises = Object.values(value).filter((field) => field instanceof Promise);

  const results = await Promise.all(promises);

  // if rule promise validation fails, it returns helpersError
  // that is object and has code property
  const helpersErrors = results
    .filter((result) => result instanceof Object && result.code !== undefined);

  if (helpersErrors.length > 0) {
    const error = new Error();
    error.details = [];
    helpersErrors
      .forEach((helpersError) => helpersErrorToErrorDetails(error.details, helpersError));

    throw error;
  }
};

const validatePlainData = async (schema, validationOptions, next, data) => {
  try {
    // NOTE: value can contain pending promises
    const value = await schema.validateAsync(data, validationOptions);

    await resolveAsyncRules(value);
  } catch (error) {
    if (error.details) {
      return next(new ValidationError(error.details));
    }
    return next(error);
  }
  return next();
};

const validateData = (data) => (
  schema,
  validationOptions = DEFAULT_VALIDATION_OPTIONS,
) => async (
  _req,
  _res,
  next,
) => validatePlainData(schema, validationOptions, next, data);

const validateAny = (
  schema,
  validationOptions,
) => async (req, res, next) => {
  const data = { ...req.params, ...req.query, ...req.body };
  return validateData(data)(schema, validationOptions)(req, res, next);
};

const validateParams = (
  schema,
  validationOptions,
) => async (req, res, next) => validateData(req.params)(schema, validationOptions)(req, res, next);

const validateQuery = (
  schema,
  validationOptions,
) => async (req, res, next) => validateData(req.query)(schema, validationOptions)(req, res, next);

const validateBody = (
  schema,
  validationOptions,
) => async (req, res, next) => validateData(req.body)(schema, validationOptions)(req, res, next);

const validateSocketData = (
  schema,
  validationOptions = DEFAULT_VALIDATION_OPTIONS,
) => async (
  data,
) => {
  let validationError;
  const next = (error) => {
    validationError = error;
  };
  await validatePlainData(schema, validationOptions, next, data);
  if (validationError !== undefined) {
    throw validationError;
  }
};

module.exports = {
  validateAny,
  validateParams,
  validateQuery,
  validateBody,
  validateSocketData,
};
