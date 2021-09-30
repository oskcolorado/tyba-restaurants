const { server } = require('./src/server');
const requestErrorHandler = require('./src/server/requestErrorHandler');

const APP_NAME = process.env.APP_NAME || 'tyba-ms';

const routes = require('./src/routes');

const app = server({
  logging: { appName: APP_NAME },
});

app.use(`/api/${APP_NAME}`, routes);
app.use(requestErrorHandler.handle);

app.start();

module.exports = app;
