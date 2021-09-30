const users = module.exports;

const { connect: db } = require('../settings/dbConnection');
const { USERS_TABLE } = require('../settings/tableNames');

users.save = user => db(USERS_TABLE)
  .insert(user);

users.get = userID => db(USERS_TABLE)
  .select('name', 'last_name', 'document', 'gender')
  .where({ id: userID })
  .first();

users.getByDocumentForLogin = document => db(USERS_TABLE)
  .select('id', 'name', 'last_name', 'document', 'gender', 'password')
  .where({ document })
  .first();
