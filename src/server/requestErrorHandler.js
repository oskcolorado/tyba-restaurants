const requestErrorHandler = module.exports;

// eslint-disable-next-line no-unused-vars
requestErrorHandler.handle = (err, req, res, next) => {
  const logName = 'ErrorHandlerMiddleware.MainHandler';
  const { log: logger = console } = req;

  if (logger.error) {
    logger.error(logName, `Error with message ${err.message} and stack: ${err.stack}`);
  } else {
    logger(logName, `Error with message ${err.message} and stack: ${err.stack}`);
  }

  const { status = 500, message = 'Error', code = 500 } = err;

  return res.status(status).send({ error: { message, code } });
};

requestErrorHandler.BaseError = function BaseError(message, code, status, stack) {
  this.message = message;
  this.status = status || code;
  this.code = code;
  this.stack = stack || new Error().stack;
};

requestErrorHandler.UnauthorizedError = function UnauthorizedError(message) {
  return new requestErrorHandler.BaseError(message, 401, 401);
};
