const assert = require('assert');

const {
  env: {
    DB_CONNECTION,
    CONNECTION_POOL_SIZE,
  },
} = process;

assert(DB_CONNECTION, 'DB_CONNECTION must be provided');
assert(CONNECTION_POOL_SIZE, 'CONNECTION_POOL_SIZE must be provided');

const DB_CLIENT = 'pg';
const DB_TIMEOUT = 30000;
const DB_IDLE_TIMEOUT_MILLIS = 10000;
const DB_MIN_CONNECTION_POOL_SIZE = 1;
const DB_MAX_CONNECTION_POOL_SIZE = parseInt(CONNECTION_POOL_SIZE, 10) || 10;

module.exports = {
  DB_CLIENT,
  DB_TIMEOUT,
  DB_CONNECTION,
  DB_IDLE_TIMEOUT_MILLIS,
  DB_MIN_CONNECTION_POOL_SIZE,
  DB_MAX_CONNECTION_POOL_SIZE,
  DB: {
    client: DB_CLIENT,
    connection: DB_CONNECTION,
    pool: { min: DB_MIN_CONNECTION_POOL_SIZE, max: DB_MAX_CONNECTION_POOL_SIZE },
    acquireConnectionTimeout: DB_TIMEOUT,
  },
};
