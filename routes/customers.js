"use strict";
var express = require('express');
var router = express.Router();
var customer_exports = require('../controllers/customers')

// /* GET all customers */
router.get('/', function(req, res, next) {
  return customer_exports.customersController.findAllCustomers(req, res)
})

/* SORT Customers BY name alphabetically */
router.get('/sort/name/:limit/:offset', function(req, res, next) {
  return customer_exports.customersController.sortCustomersByName(req, res)
});

/* SORT MOVIES BY release_date */
router.get('/sort/registered_at/:limit/:offset', function(req, res, next) {
  return customer_exports.customersController.sortCustomersByRegisteredAt(req, res)
});

module.exports = router;
