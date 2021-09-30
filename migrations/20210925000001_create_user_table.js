const { USERS_TABLE } = require('../src/settings/tableNames');

module.exports.up = knex => knex.schema.createTable(USERS_TABLE, (table) => {
  table.bigIncrements('id');
  table.string('name').notNullable();
  table.string('last_name').notNullable();
  table.integer('document').notNullable();
  table.string('password').notNullable();
  table.enu('gender', ['male', 'female']);
  table.timestamps(true, true);
});

module.exports.down = knex => knex.schema.dropTable(USERS_TABLE);
