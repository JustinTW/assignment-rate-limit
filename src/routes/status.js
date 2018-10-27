const express = require('express');

const router = express.Router();

/* GET rate limit status listing. */
router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ a: 1 }, null, 3));
});

module.exports = router;
