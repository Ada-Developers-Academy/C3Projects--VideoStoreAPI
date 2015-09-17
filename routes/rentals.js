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

module.exports = router;
