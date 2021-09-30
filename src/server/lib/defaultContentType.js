module.exports = function defaultContentType(app) {
  app.use((req, res, next) => {
    const currentContentType = res.get('Content-Type');

    if (!currentContentType) {
      res.header('Content-Type', 'application/json');
    }

    return next();
  });
};
