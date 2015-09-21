"use strict";

var express = require('express');
var router = express.Router();
var zomgController = require("../controllers/zomgController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Video Killed The Radio Star' });
});

/* GET zomg page. */
router.get('/zomg', function(req, res, next) {
  return zomgController.itWorks(req, res)
});

/* GET all customers sorted by registration. */
router.get("/all/:sort/:page", function(req, res, next) {
  var sort = req.params.sort;
  console.log("req.params.page " + req.params.page);

  switch (sort) {
    case "registered":
      return zomgController.registered_at(req, res);
      break;
    case "name":
    case "zip":
      console.log("these sort methods are not yet supported: name, zip");
      break;
    default: // all
      return zomgController.all_customers(req, res);
      break;
  }
});

/* GET all customers sorted by registration. */
router.get("/all/registered", function(req, res, next) {
  console.log("req.params.page " + req.params.page);
  return zomgController.registered_at(req, res);
});


/* GET all customers. */
router.get('/all', function(req, res, next) {
  console.log("/all");
  return zomgController.all_customers(req, res)
});

module.exports = router;
