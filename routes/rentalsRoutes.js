"use strict";

var express = require('express');
var router = express.Router();
var rentalsController = require("../controllers/rentalsController");

// GET test /rentals/test
router.get("/test", function(req, res, next) {
  return rentalsController.testFxn(req, res);
});

// GET a list of customers with overdue movies
router.get("/overdue", function (req, res, next) {
  return rentalsController.overdue(req, res);
});
router.get("/overdue/:page", function (req, res, next) {
  return rentalsController.overdue(req, res);
});

// GET the details about a particular title possibly available to rent
router.get("/:title", function(req, res, next) {
  return rentalsController.movieInfo(req, res);
});

// GET a list of all customers who currently have a copy of a given title
router.get("/:title/customers", function(req, res, next) {
  return rentalsController.customers(req, res);
})

// PATCH to /:title/customer/:id to check in a title
router.patch("/:title/customers/:id", function(req, res, next) {
  return rentalsController.checkIn(req, res);
})

// POST to /:title/customer/:id to check out a title
router.post("/:title/customers/:id", function(req, res, next) {
  return rentalsController.checkIn(req, res);
})

module.exports = router;
