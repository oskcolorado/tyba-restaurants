const restaurants = module.exports;

const restaurantsProvider = require('../providers/restaurants');
const transactionsRepository = require('../repositories/transactions');

restaurants.findByCity = async (city, user) => {
  const restaurantsByCity = await restaurantsProvider.getByCity(city);


  const transaction = {
    city,
    user_id: user.sub,
  };
  await transactionsRepository.save(transaction);

  return restaurantsByCity;
};
