const provider = module.exports;

const rp = require('request-promise');
const { BaseError } = require('../../server/lib/serverErrorHandler');
const providerErrorHandler = require('./providerErrorHandler');

const getRPWithDefaults = () => {
  const APP_ID_ENVAR = 'x_application_id';
  const APP_ID_HEADER = 'x-application-id';
  const APP_ID = process.env[APP_ID_ENVAR];

  return rp.defaults({ headers: { [APP_ID_HEADER]: APP_ID } });
};

const rpWithDefaults = getRPWithDefaults();

const SERVER_ERROR = 500;
const SUPPORTED_METHODS = ['get', 'post', 'put', 'del'];

provider.requestWithRetries = (methodName, reqParams, retries = 0) => {
  const { resolveFullError = false, ...restOfReqParams } = reqParams;

  return rpWithDefaults[methodName](restOfReqParams)
    .catch((err) => {
      const statusCode = err.statusCode || err.code || SERVER_ERROR;

      if (statusCode >= SERVER_ERROR && retries > 0) {
        return provider.requestWithRetries(methodName, reqParams, retries - 1);
      }

      if (resolveFullError) throw err;

      const errorMessage = providerErrorHandler.parseErrorMessage(err);

      throw new BaseError(errorMessage, statusCode);
    });
};

const getRequestMethodWrapper = (methodName, reqParamDefaults = {}) => (
  (reqParams, retries = 0) => provider.requestWithRetries(methodName, { ...reqParamDefaults, ...reqParams }, retries)
);

SUPPORTED_METHODS.forEach((methodName) => {
  provider[methodName] = getRequestMethodWrapper(methodName);
});
