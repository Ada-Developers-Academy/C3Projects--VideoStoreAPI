var express = require('express');
var router = express.Router();
var customer_exports = require('../controllers/customers');

// all customers
router.get('/', function(req, res, next) {
  return customer_exports.customersController.index(req, res);
});

// all customers by name (optional query for number (n=#) & page (p=#))
router.get('/by_name', function(req, res, next) {
  return customer_exports.customersController.showByName(req, res);
});

// all customers by registered at (optional query for number (n=#) & page (p=#))
router.get('/by_registered_at', function(req, res, next) {
  return customer_exports.customersController.showByRegistered_at(req, res);
});

// all customers by postal code (optional query for number (n=#) & page (p=#))
router.get('/by_postal_code', function(req, res, next) {
  return customer_exports.customersController.showByPostalCode(req, res);
});

// a single customer's currently checked out movies
router.get('/:id/current', function(req, res, next) {
  return customer_exports.customersController.showCustomerCurrent(req, res);
});

// a single customer's previously checked out (& returned) movies
router.get('/:id/history', function(req, res, next) {
  return customer_exports.customersController.showCustomerHistory(req, res);
});

module.exports = router;
