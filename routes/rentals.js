"use strict";
var express = require('express');
var router = express.Router();
var rental_exports = require('../controllers/rentals')

/* GET all customers rental history */
router.get('/', function(req, res, next) {
  return rental_exports.rentalsController.customersRentalHistory(req, res);
});

router.get('/overdue', function(req, res, next) {
  return rental_exports.rentalsController.customersOverdue(req, res);
});

router.put('/checkin', function(req, res, next) {
  return rental_exports.rentalsController.checkin(req, res);
});

router.post('/checkout', function(req, res, next) {
  console.log(req.body);
  rental_exports.rentalsController.checkout(req, res);
});

module.exports = router;
// title?page=:page&number=:number
