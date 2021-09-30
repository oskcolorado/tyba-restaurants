const assert = require('assert');
const debug = require('debug')(`${process.env.APP_NAME}:server`);
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const defaultContentType = require('./lib/defaultContentType');
const ErrorHandler = require('./lib/serverErrorHandler');

const DEFAULT_PATH = '/';
const { PORT } = process.env;
assert(PORT, 'PORT is required');

function disableAppCache(app) {
  app.disable('etag');

  app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', 0);

    return next();
  });
}

function setupAccessLog(app, prefix, config = {}) {
  if (!config.disabled) {
    morgan.token('platform', req => req.platform || '');
    morgan.token('app-version', req => req.app_version || '');
    morgan.token('now', () => new Date().toString());

    const skipPath = config.hc && config.hc.path ? config.hc.path : DEFAULT_PATH;
    const skip = function (req) { return req.method === 'GET' && req.path === skipPath; };

    app.use(
      morgan(
        `${prefix ? `${prefix}: ` : ''}[:now] :platform :app-version - :method :url :status - :response-time ms`,
        { skip },
      ),
    );
  }
}

module.exports.server = function (config = {}) {
  debug('Initializing express server...');
  const app = express();

  setupAccessLog(
    app, config.logging && config.logging.appName,
    Object.assign({}, config.accessLog, { hc: config.healthCheck }),
  );

  app.use(bodyParser.json(config.bodyParser || { limit: '1mb' }));

  if (config.disableCache === undefined || !!config.disableCache) {
    debug('HTTP cache disabled.');
    disableAppCache(app);
  }

  app.use(ErrorHandler);

  // Override app.listen with custom app.start
  app.start = function (callback) {
    defaultContentType(app);
    debug('Server starting...');

    return app.listen(PORT, (err, data) => {
      if (err) {
        if (callback) {
          callback(err, data);
        }

        return console.error(err);
      }

      if (config.logging && config.logging.appName) {
        console.log(`${config.logging.appName}:`, `Web server listening on port ${PORT}`);
      } else {
        console.log(`Web server listening on port ${PORT}`);
      }

      if (callback) {
        callback(err, data);
      }

      return null;
    });
  };

  return app;
};
