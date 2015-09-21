var express = require('express');
var router = express.Router();
var customers_exports = require('../controllers/customers')

/* GET home page. */
router.get('/', function(req, res, next) {
  return customers_exports.customersController.index(req, res);
});

router.get('/name/:records/:offset', function(req, res, next) {
  return customers_exports.customersController.name(req, res);
});

router.get('/registered/:records/:offset', function(req, res, next) {
  return customers_exports.customersController.registered(req, res);
});

router.get('/postal/:records/:offset', function(req, res, next) {
  return customers_exports.customersController.postal(req, res);
});

router.get('/current/:id', function(req, res, next) {
  return customers_exports.customersController.current(req, res);
});

router.get('/checkedout/:id', function(req, res, next) {
  return customers_exports.customersController.checkedout(req, res);
});

router.get('/history/:id', function(req, res, next) {
  return customers_exports.customersController.history(req, res);
});

module.exports = router;
