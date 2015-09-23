"use strict";
var express = require('express');
var router = express.Router();
var rental_exports = require('../controllers/rentals')

/* GET all customers rental history */
router.get('/', function(req, res, next) {
  return rental_exports.rentalsController.customersRentalHistory(req, res);
});

module.exports = router;
// title?page=:page&number=:number
