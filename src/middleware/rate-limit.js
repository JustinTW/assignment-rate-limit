const RateLimit = () => {
  const rateLimit = (req, res, next) => {
    res.setHeader('X-RateLimit-Limit', 60);
    res.setHeader('X-RateLimit-Remaining', 40);

    next();
  };
  return rateLimit;
};

module.exports = RateLimit;
