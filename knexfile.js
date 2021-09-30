const {
  DB_CLIENT,
  DB_TIMEOUT,
  DB_CONNECTION,
  DB_IDLE_TIMEOUT_MILLIS,
  DB_MIN_CONNECTION_POOL_SIZE,
  DB_MAX_CONNECTION_POOL_SIZE,
} = require('./src/settings/database');

const MIGRATIONS_DIRECTORY = './migrations';

module.exports = {
  client: DB_CLIENT,
  connection: DB_CONNECTION,
  pool: {
    min: DB_MIN_CONNECTION_POOL_SIZE,
    max: DB_MAX_CONNECTION_POOL_SIZE,
    idleTimeoutMillis: DB_IDLE_TIMEOUT_MILLIS,
    createTimeoutMillis: DB_TIMEOUT,
    acquireTimeoutMillis: DB_TIMEOUT,
  },
  connectionTimeout: DB_TIMEOUT,
  acquireConnectionTimeout: DB_TIMEOUT,
  migration: {
    directory: MIGRATIONS_DIRECTORY,
  },
};
