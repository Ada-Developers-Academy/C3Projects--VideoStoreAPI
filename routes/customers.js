var express = require('express');
var router = express.Router();
var customer_exports = require('../controllers/customers');

/* GET customers listing. */

// "/customers "
router.get('/', function(req, res, next) {
  return customer_exports.customersController.customers(req, res);
});

// "/customers/{:id}"
router.get('/:id', function(req, res, next) {
  return customer_exports.customersController.customer(req, res);
});

module.exports = router;
