const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'rate-limit-demo',
    remaining: req.rateLimit.remaining,
    key: req.ip,
    count: req.rateLimit.count
  });
});

module.exports = router;
