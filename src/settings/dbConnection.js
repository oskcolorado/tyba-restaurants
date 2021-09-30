const dbConnection = module.exports;

const knex = require('knex');

const { DB } = require('./database');

dbConnection.connect = knex(DB);
