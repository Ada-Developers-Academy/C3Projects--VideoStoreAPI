var express = require('express');
var router = express.Router();
var rentals_exports = require('../controllers/rentals');

// router.get('/checkout/:customer_id/:title', function(req, res, next) {
//   return rentals_exports.rentalsController.create(req, res);
// });

router.post('/checkout', rentals_exports.create);

// router.post('/checkout', function(req, res, next) {
//
//   return rentals_exports.rentalsController.create(req, res);
// });

module.exports = router;
