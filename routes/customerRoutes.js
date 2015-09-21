"use strict";

var express = require('express');
var router = express.Router();
var customerController = require("../controllers/customerController");

/* GET all customers. */
router.get('/all', function(req, res, next) {
  return customerController.all(req, res);
});

router.get("/potato", function(req, res, next) {
  return customerController.potato(req, res);
});

module.exports = router;
