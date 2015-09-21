var express = require('express');
var router = express.Router();

var customer_exports = require('../controllers/customers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  return customer_exports.customersController.index(req, res);
});

 // /customers/:id ?? returns info from rentals table
router.get('/one_customer', function(req, res, next) {
  // return one customer based on id
  //return customer_exports.customerController.one_customer(req, res);
});

// customers/:id/current_rentals
router.get('/:id/current_rentals', function(req, res, next) {
  return customer_exports.customersController.current_rentals(req, res, req.params.id);
});

// customers/name/1
router.get('/:column/:number', function(req, res, next) {
  return customer_exports.customersController.subset(req, res, req.params.column, req.params.number);
});

module.exports = router;
