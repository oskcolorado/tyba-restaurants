const users = module.exports;

const usersService = require('../services/users');

users.find = async (req, res, next) => {
  const section = 'users.find:';
  const { user: { sub: userID }, log: logger = console } = req;

  return usersService.find(userID, { logger })
    .then(resp => res.send(resp)).catch((error) => {
      logger.error(section, `Error ${JSON.stringify(error.message || error)} AND stack ${error.stack}`);

      return next(error);
    });
};
