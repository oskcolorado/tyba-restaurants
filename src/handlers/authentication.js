const authentication = module.exports;

const moment = require('moment');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');

const { BaseError } = require('../server/requestErrorHandler');
const validator = require('./validator');
const userSchema = require('./validator/schemas/user');
const loginSchema = require('./validator/schemas/login');
const usersService = require('../services/users');
const usersRepository = require('../repositories/users');
const authenticationsRepository = require('../repositories/authentications');

const { SECRET_TOKEN } = process.env;
const saltRounds = 10;

const createToken = (user) => {
  const payload = {
    sub: user.id,
    name: user.name,
    last_name: user.last_name,
    document: user.document,
    iat: moment().unix(),
    exp: moment().add(1, 'hours').unix(),
  };

  return jwt.encode(payload, SECRET_TOKEN);
};

authentication.encodePassword = password => bcrypt.hashSync(password, saltRounds);
authentication.comparePassword = (password, passwordEncoded) => bcrypt.compareSync(password, passwordEncoded);

authentication.login = async (req, res, next) => {
  const section = 'authentication.login:';
  const { body: credentials, log: logger = console } = req;

  const [valid, message] = validator.validate(credentials, loginSchema);
  if (!valid) return next(new BaseError(message, 400));

  const user = await usersRepository.getByDocumentForLogin(credentials.document)
    .catch((error) => {
      logger.error(section, `Error ${JSON.stringify(error.message || error)} AND stack ${error.stack}`);

      return next(error);
    });

  if (!user || !authentication.comparePassword(credentials.password, user.password)) {
    return next(new BaseError('invalid credentials', 400));
  }

  delete user.password;

  const token = createToken(user);

  await authenticationsRepository.saveTokenCache(user.id, token);

  return res.send({ token });
};

authentication.signup = async (req, res, next) => {
  const section = 'authentication.signup:';
  const { body: user, log: logger = console } = req;

  const [valid, message] = validator.validate(user, userSchema);
  if (!valid) return next(new BaseError(message, 400));

  user.password = authentication.encodePassword(user.password);

  return usersService.create(user, { logger })
    .then(resp => res.status(201).send(resp)).catch((error) => {
      logger.error(section, `Error ${JSON.stringify(error.message || error)} AND stack ${error.stack}`);

      return next(error);
    });
};

authentication.loguot = async (req, res, next) => {
  const section = 'authentication.logout:';
  const { user, logger = console } = req;

  return authenticationsRepository.deleteTokenCached(user.sub)
    .then(() => res.status(204).send()).catch((error) => {
      logger.error(section, `Error ${JSON.stringify(error.message || error)} AND stack ${error.stack}`);

      return next(error);
    });
};
