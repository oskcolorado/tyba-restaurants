const providerErrorHandler = module.exports;

const UNDEFINED_ERROR_MESSAGE = 'undefined error';

providerErrorHandler.parseErrorMessage = (errorMessage) => {
  const { error } = errorMessage;

  if (error && !error.errors) {
    return error.message || ((error.error && error.error.message) || error.error) || UNDEFINED_ERROR_MESSAGE;
  }

  const { errors } = error || {};

  if (errors) {
    if (typeof errors === 'string' || errors instanceof String) return errors;

    const errorKeys = Object.keys(errors);

    return errorKeys.reduce((previousMessage, errorKey) => {
      let value = errors[errorKey];

      if (Array.isArray(value)) {
        value = value.reduce((previousValue, currentValue) => `${currentValue} ${previousValue}`, '');
      }

      return `${previousMessage} ${value} `;
    }, '');
  }

  return errorMessage.message || errorMessage;
};
