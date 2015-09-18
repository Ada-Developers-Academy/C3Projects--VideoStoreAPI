var express = require('express');
var router = express.Router();

// Project Baseline Requirement
router.get('/zomg', function(req, res, next) {
  res.json('it works!');
});

module.exports = router;
