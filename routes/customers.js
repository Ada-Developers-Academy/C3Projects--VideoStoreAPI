var express = require('express');
var router = express.Router();
var customer_exports = require('../controllers/customers');

router.get('/', function(req, res, next) {
  return customer_exports.customersController.all(req, res);
});

router.get('/registered_at_sort/:records_per_page/:offset', function(req, res, next) {
  return customer_exports.customersController.registered_at_sort(req, res);
});

module.exports = router;
