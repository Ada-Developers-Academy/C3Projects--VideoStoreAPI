"use strict";
var express = require('express');
var router = express.Router();
var customer_exports = require('../controllers/customers')

// /* GET all customers */
router.get('/', function(req, res, next) {
  return customer_exports.customersController.findAllCustomers(req, res)
})

module.exports = router;
