const { TRANSACTIONS_TABLE, USERS_TABLE } = require('../src/settings/tableNames');

module.exports.up = knex => knex.schema.createTable(TRANSACTIONS_TABLE, (table) => {
  table.bigIncrements('id');
  table.integer('user_id').index().notNullable().references(`${USERS_TABLE}.id`);
  table.string('city').notNullable();
  table.timestamps(true, true);
});

module.exports.down = knex => knex.schema.dropTable(TRANSACTIONS_TABLE);
