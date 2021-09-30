const express = require('express');

const authMiddleware = require('./server/lib/authMiddleware');
const statusHandler = require('./handlers/status');
const usersHandler = require('./handlers/users');
const restaurantsHandler = require('./handlers/restaurants');
const transactionsHandler = require('./handlers/transactions');
const authenticationHandler = require('./handlers/authentication');

const router = express.Router();

const { API_KEY } = process.env;
authMiddleware.setApiKey(API_KEY);

router.get('/status', statusHandler.info);

router.post('/login', authMiddleware.apiKey, authenticationHandler.login);
router.post('/signup', authMiddleware.apiKey, authenticationHandler.signup);
router.get('/logout', authMiddleware.userAuth, authenticationHandler.loguot);

router.get('/user', authMiddleware.userAuth, usersHandler.find);

router.get('/restaurants/:city', authMiddleware.userAuth, restaurantsHandler.findByCity);

router.get('/transactions', authMiddleware.userAuth, transactionsHandler.findByUserID);

module.exports = router;
