var express = require('express');
var router = express.Router();
var rentals_exports = require("../controllers/rentals");

/* GET home page. */
router.get('/:title', function(req, res, next) {
 return rentals_exports.rentalsController.movie_available(req, res);
});

router.get('/customers/current/:title', function(req, res, next) {
 return rentals_exports.rentalsController.customers_current(req, res);
});

router.put('/checkout/:title/:customer_id', function(req, res, next) {
 return rentals_exports.rentalsController.checkout(req, res);
});

router.put('/checkin/:title/:customer_id', function(req, res, next) {
 return rentals_exports.rentalsController.checkin(req, res);
});

router.get('/customers/overdue', function(req, res, next) {
 return rentals_exports.rentalsController.overdue(req, res);
});

module.exports = router;
