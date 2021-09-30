const authentications = module.exports;

const Ioredis = require('ioredis');
const redisConfig = require('../settings/redis');

const AUTHENTICATION_KEY = 'tyba_ms:authentications';
const EXP = 60 * 60;

authentications.redis = new Ioredis(redisConfig);

authentications.getTokenCached = (userID, options = {}) => {
  const section = 'authentications.getTokenCached:';
  const { logger = console || console } = options;

  const key = `${AUTHENTICATION_KEY}:userID:${userID}`;

  try {
    return authentications.redis.get(key).then(res => JSON.parse(res));
  } catch (error) {
    logger.error(section, `Error get token from userID ${userID}: ${JSON.stringify(error.message || error)}`);
  }

  return Promise.resolve();
};

authentications.saveTokenCache = (userID, token, options = {}) => {
  const section = 'authentications.saveTokenCache:';
  const { logger = console || console } = options;

  if (!token) {
    return undefined;
  }

  const key = `${AUTHENTICATION_KEY}:userID:${userID}`;

  try {
    return authentications.redis.set(key,
      (JSON.stringify(token)), 'EX', EXP);
  } catch (error) {
    logger.error(section,
      `Error caching token for userID ${userID}: ${JSON.stringify(error.message || error)}`);
  }

  return Promise.resolve();
};

authentications.deleteTokenCached = (userID, options = {}) => {
  const section = 'authentications.deleteTokenCached:';
  const { logger = console || console } = options;

  const key = `${AUTHENTICATION_KEY}:userID:${userID}`;

  try {
    return authentications.redis.del(key);
  } catch (error) {
    logger.error(section, `Error deleting token from userID ${userID}: ${JSON.stringify(error.message || error)}`);
  }

  return Promise.resolve();
};
