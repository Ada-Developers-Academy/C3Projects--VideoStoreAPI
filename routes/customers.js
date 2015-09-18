var express = require('express');
var router = express.Router();
var customers_exports = require('../controllers/customers');

/* GET /customers */
router.get('/', function(req, res, next) {
  return customers_exports.customersController.index(req, res);
});

router.get('/:column/:n/:p', function(req, res, next) {
  return customers_exports.customersController.by_column(req, res);
});

module.exports = router;
