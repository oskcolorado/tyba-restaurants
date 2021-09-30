const authMiddleware = module.exports;

const jwt = require('jwt-simple');
const moment = require('moment');

const { UnauthorizedError, BaseError } = require('../requestErrorHandler');
const authenticationsRepository = require('../../repositories/authentications');

const { SECRET_TOKEN } = process.env;

authMiddleware.API_KEY = undefined;

authMiddleware.setApiKey = ((apiKey) => {
  authMiddleware.API_KEY = apiKey;
});

authMiddleware.apiKey = ((req, res, next) => {
  const authorization = req.header('Authorization');
  const apiKey = req.header('API_KEY');

  if (authorization && (apiKey === authMiddleware.API_KEY)) return next();

  throw new UnauthorizedError('unauthorized');
});

authMiddleware.userAuth = (async (req, res, next) => {
  if (!req.headers.authorization) return next(new BaseError('authorization is missing', 403));

  const token = req.headers.authorization.split(' ')[1];

  try {
    const payload = jwt.decode(token, SECRET_TOKEN);
    if (payload.exp <= moment().unix()) {
      return next(new BaseError('the token has expired', 401));
    }

    const tokenCached = await authenticationsRepository.getTokenCached(payload.sub);

    if (!tokenCached || tokenCached !== token) return next(new BaseError('invalid token', 401));

    req.user = payload;

    return next();
  } catch (error) {
    return next(new BaseError('invalid token', 401));
  }
});
