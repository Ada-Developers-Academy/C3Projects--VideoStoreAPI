var express = require('express');
var router = express.Router();
var customers_exports = require('../controllers/customers');

/* GET /customers */
router.get('/', function(req, res, next) {
  return customers_exports.customersController.index(req, res);
});

/* GET /customers/:column/:n/:p */
router.get('/:column/:n/:p', function(req, res, next) {
  return customers_exports.customersController.by_column(req, res);
});

/* GET /customers/:customer_id/movies */
router.get('/:customer_id/movies', function(req, res, next) {
  return customers_exports.customersController.movies_by_customer_current(req, res);
});

/* GET /customers/:id/history */
router.get('/:customer_id/history', function(req, res, next) {
  return customers_exports.customersController.movies_by_customer_history(req, res);
});

/* GET /customers/overdue */
router.get('/overdue', function(req, res, next) {
  return customers_exports.customersController.customers_overdue(req, res);
});

module.exports = router;
