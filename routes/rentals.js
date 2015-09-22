var express = require('express');
var router = express.Router();
var rentals_exports = require('../controller/rentals');

// '/rentals/:title/current/:sort_option'
router.get('/:title/current/:sort_option', function(req, res, next) {
  return rentals_exports.rentalsController.current_rentals(req, res);});

module.exports = router;
