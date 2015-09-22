var express = require('express');
var router = express.Router();
var rentals_exports = require('../controller/rentals');

// '/rentals/:title/current/:sort_option'
router.get('/:title/current/:sort_option', function(req, res, next) {
  return rentals_exports.rentalsController.current_rentals(req, res);
});

// '/rentals/:title/past/:sort_option'
router.get('/:title/past/:sort_option', function(req, res, next) {
  return rentals_exports.rentalsController.past_rentals(req, res);
});

// '/rentals/overdue'
router.get('/overdue', function(req, res, next) {
  return rentals_exports.rentalsController.overdue(req, res);
});

module.exports = router;
