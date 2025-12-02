// middlewares/sanitize.js
module.exports.sanitizeBody = (allowedKeys) => {
  return (req, res, next) => {
    const input = req.body || {};
    const clean = {};
    allowedKeys.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(input, k)) clean[k] = input[k];
    });
    req.body = clean;
    next();
  };
};
