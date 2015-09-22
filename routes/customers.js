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

/* SORT Customers BY registered_at */
router.get('/sort/registered_at/:limit/:offset', function(req, res, next) {
  return customer_exports.customersController.sortCustomersByRegisteredAt(req, res)
});

/* SORT Customers BY postal_code */
router.get('/sort/postal_code/:limit/:offset', function(req, res, next) {
  return customer_exports.customersController.sortCustomersByPostalCode(req, res)
});


module.exports = router;
