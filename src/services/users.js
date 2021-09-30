const users = module.exports;

const { BaseError } = require('../server/requestErrorHandler');
const usersRepository = require('../repositories/users');

users.create = async (user, options = {}) => {
  const section = 'usersService.create:';
  const { logger } = options;

  await usersRepository.save(user).catch((error) => {
    logger.error(section, error);

    throw new BaseError(error, 400);
  });
};

users.find = async (userID, options = {}) => {
  const section = 'usersService.find:';
  const { logger } = options;

  const user = await usersRepository.get(userID).catch((error) => {
    logger.error(section, error);

    throw new BaseError(error, 400);
  });

  if (!user) throw new BaseError('user not found', 404);

  return user;
};
