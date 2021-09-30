const restaurants = module.exports;

const { BaseError } = require('../server/requestErrorHandler');
const restaurantsService = require('../services/restaurants');

restaurants.findByCity = async (req, res, next) => {
  const section = 'restaurants.findByCity:';
  const { params: { city }, user, log: logger = console } = req;

  if (!city || city === '') {
    return next(new BaseError('invalid city', 400));
  }

  return restaurantsService.findByCity(city, user)
    .then(resp => res.send(resp)).catch((error) => {
      logger.error(section, `Error ${JSON.stringify(error.message || error)} AND stack ${error.stack}`);

      return next(error);
    });
};
