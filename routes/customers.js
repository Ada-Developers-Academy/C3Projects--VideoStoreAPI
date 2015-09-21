var express = require('express');
var router = express.Router();
var customer_exports = require('../controllers/customers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  return customer_exports.customersController.index(req, res);
});

router.get('/:id', function(req, res, next) {
  return customer_exports.customersController.show(req, res);
});

router.get('/by_name', function(req, res, next) {
  return customer_exports.customersController.showByName(req, res);
});

router.get('/by_registered_at', function(req, res, next) {
  return customer_exports.customersController.showByRegistered_at(req, res);
});

router.get('/by_postal_code', function(req, res, next) {
  return customer_exports.customersController.showByPostalCode(req, res);
});

module.exports = router;
