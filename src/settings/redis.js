const { REDIS_PORT, REDIS_HOST } = process.env;

const assert = require('assert');

assert(REDIS_HOST, 'REDIS_HOST is required');
assert(REDIS_PORT, 'REDIS_PORT is required');

module.exports = {
  port: REDIS_PORT,
  host: REDIS_HOST,
};
