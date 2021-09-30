const transactions = module.exports;

const transactionsRepository = require('../repositories/transactions');

transactions.findByUserID = async user => transactionsRepository.getByUserID(user.sub);
