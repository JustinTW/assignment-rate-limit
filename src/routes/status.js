const express = require('express');

const router = express.Router();

/* GET rate limit status listing. */
router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({}, null, 3));
});

module.exports = router;
