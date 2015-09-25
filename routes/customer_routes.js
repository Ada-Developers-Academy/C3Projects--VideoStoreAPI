"use strict";

var express = require('express');
var router = express.Router();
var controller = require("../controllers/customers_controller");

// GET a paginated list of all customers
router.get("/all", controller.all);
router.get("/all/:page", controller.all);

// GET a paginated subset of customers, sorted by a passed in attribute
router.get("/all/sort_by=:sort_by", controller.allSorted);
router.get("/all/sort_by=:sort_by/:page", controller.allSorted);

// GET a single customer profile
router.get("/:id", controller.show);

module.exports = router;
