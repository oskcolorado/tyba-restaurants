const restaurants = module.exports;

const requestor = require('./requestor');

const { RESTAURANT_API_KEY } = process.env;
const logger = console;
const BASE_URL = 'https://maps.googleapis.com/maps';

restaurants.getByCity = (city) => {
  const uri = `${BASE_URL}/api/place/textsearch/json?query=restaurants+${city}&key=${RESTAURANT_API_KEY}`;
  const headers = {
    authorization: 'tyba-ms',
    'Content-Type': 'application/json',
  };
  const json = true;
  const retries = 3;

  return requestor.get({ uri, headers, json }, retries)
    .then(res => res.results)
    .catch((err) => {
      logger.error(`Could not get character: ${err}`);

      return {};
    });
};
