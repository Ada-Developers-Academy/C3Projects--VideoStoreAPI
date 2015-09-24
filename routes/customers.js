var express = require('express');
var router = express.Router();

var customer_exports = require('../controllers/customers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  return customer_exports.customersController.index(req, res);
});

// customers/:id/current_rentals
router.get('/:id/current_rentals', function(req, res, next) {
  return customer_exports.customersController.current_rentals(req, res, req.params.id);
});

// customers/:id/rental_history
router.get('/:id/rental_history', function(req, res, next) {
  return customer_exports.customersController.rental_history(req, res, req.params.id);
});

// customers/name/1
router.get('/:column/:number', function(req, res, next) {
  return customer_exports.customersController.subset(req, res, req.params.column, req.params.number);
});

module.exports = router;
