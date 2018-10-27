const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  const requestNumber =
    res.getHeader('X-RateLimit-Limit') - res.getHeader('X-RateLimit-Remaining');

  res.render('index', {
    title: 'rate-limit-demo',
    requestNumber
  });
});

module.exports = router;
