const transactions = module.exports;

const transactionsService = require('../services/transactions');

transactions.findByUserID = async (req, res, next) => {
  const section = 'transactions.findByUserID:';
  const { user, log: logger = console } = req;

  return transactionsService.findByUserID(user)
    .then(resp => res.send(resp)).catch((error) => {
      logger.error(section, `Error ${JSON.stringify(error.message || error)} AND stack ${error.stack}`);

      return next(error);
    });
};
