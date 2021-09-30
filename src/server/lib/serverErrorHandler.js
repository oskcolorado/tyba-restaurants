module.exports = function (err, req, res, next) {
  if (err) {
    req.log('Error:', err.stack);

    return res.status(err.status).send({ message: err.message });
  }

  return next();
};
