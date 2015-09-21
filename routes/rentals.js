var express = require('express');
var router = express.Router();
var movie_exports = require('../controllers/movies');
var customer_exports = require('../controllers/customers');
var rental_exports = require('../controllers/rentals');

// GET /rentals
router.get('/', function(req, res, next) {
  rental_exports.rentalsController.getAllRentals(res);
});

// GET /rentals/overdue
router.get('/overdue', function(req, res, next) {
  rental_exports.rentalsController.getAllOverdue(res);
});

// GET /rentals/currently_out
router.get('/currently_out', function(req, res, next){
  rental_exports.rentalsController.getAllCurrentlyOut(res);
});


module.exports = router;
