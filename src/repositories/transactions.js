const transactions = module.exports;

const { connect: db } = require('../settings/dbConnection');
const { TRANSACTIONS_TABLE } = require('../settings/tableNames');

transactions.save = transaction => db(TRANSACTIONS_TABLE)
  .insert(transaction);

transactions.getByUserID = userID => db(TRANSACTIONS_TABLE)
  .select()
  .where({ user_id: userID })
  .orderBy('created_at', 'desc');
