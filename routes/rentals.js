var express = require('express');
var router = express.Router();
var rentals_exports = require('../controller/rentals');

// '/rentals/:title/current/:sort_option'
// :sort_option - id, name, checkout_date
router.get('/:title/current/:sort_option', function(req, res, next) {
  return rentals_exports.rentalsController.current_rentals(req, res);
});

// '/rentals/:title/past/:sort_option'
router.get('/:title/past/:sort_option', function(req, res, next) {
  return rentals_exports.rentalsController.past_rentals(req, res);
});

// '/rentals/overdue'
// *GET*  rental/customers/overdue
router.get('/overdue', function(req, res, next) {
  return rentals_exports.rentalsController.overdue(req, res);
});

// *GET*  rental/:title/available
router.get('/:title/available', function(req, res, next) {
  return rentals_exports.rentalsController.check_inventory(req, res);
});

// *POST* rental/:title/:customer_id/checkin
router.post('/:title/:customer_id/checkin', function(req, res, next) {
  return rentals_exports.rentalsController.checkin(req, res);
});

// *POST* rental/:title/:customer_id/checkout
router.post('/:title/:customer_id/checkout', function(req, res, next) {
  return rentals_exports.rentalsController.checkout(req, res);
});


module.exports = router;
