var express = require('express');
var router = express.Router();
var rentals_exports = require('../controllers/rentals');

/* GET RENTAL ROUTES */
router.get('/', function(req, res, next) {
  return rentals_exports.rentalsController.rentals(req, res);
});

router.get('/overdue', function(req, res, next) {
  return rentals_exports.rentalsController.overdue_rentals(req, res);
});

router.get('/:customer_id/:movie_title', function(req, res, next) {
  return rentals_exports.rentalsController.create_rental(req, res);
});

router.get('/return/:customer_id/:movie_title', function(req, res, next) {
  return rentals_exports.rentalsController.return_rental(req, res);
});

module.exports = router;
