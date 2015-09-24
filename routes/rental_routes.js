"use strict";

var express = require('express');
var router = express.Router();
var controller = require("../controllers/rentals_controller");

// GET a paginated list of customers with overdue movies
router.get("/overdue", controller.overdue);
router.get("/overdue/:page", controller.overdue);

// GET the details about a particular title possibly available to rent
router.get("/:title", controller.movieInfo);

// GET a list of all customers who currently have a copy of a given title
router.get("/:title/customers", controller.customers);

// // PATCH to /:title/customer/:id to check in a title
// router.patch("/:title/customers/:id", controller.return);
//
// // POST to /:title/customer/:id to check out a title
// router.post("/:title/customers/:id", controller.checkOut);

module.exports = router;
