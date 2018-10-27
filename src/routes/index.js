const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'rate-limit-demo',
    requests: req.rateLimit.requests
  });
});

module.exports = router;
