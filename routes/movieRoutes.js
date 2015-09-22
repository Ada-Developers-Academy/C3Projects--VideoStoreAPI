"use strict";

var express = require('express');
var router = express.Router();
var movieController = require("../controllers/movieController");

router.get('/test', function(req, res, next) {
  return movieController.test(req, res);
});

router.get('/:title', function(req, res, next) {
  return movieController.by_title(req, res);
});

router.get('/:title/renting', function(req, res, next) {
  return movieController.whos_renting(req, res);
});

router.get('/:title/rented/:sort=:query/:page', function(req, res, next) {
  var sort = req.params.sort;

  switch (sort) {
    case "customer_id":
      console.log("sort: " + sort);
      return movieController.customer_id(req, res);
      break;
    case "customer_name":
      return movieController.customer_name(req, res);
      break;
    case "check_out_date":
      return movieController.check_out_date(req, res);
      break;
    default: // all
      return movieController.all_movies(req, res);
      break;
    }
});

router.get('/all/:page', function(req, res, next) {
  return movieController.all_movies(req, res);
});

router.get("/all/:sort/:page", function(req, res, next) {
  var sort = req.params.sort;

  switch (sort) {
    case "release_date":
      console.log("sort: " + sort);
      return movieController.release_date(req, res);
      break;
    case "title":
      return movieController.title(req, res);
      break;
    default: // all
      return movieController.all_movies(req, res);
      break;
  }
});

// /* GET all customers. */
// router.get('/movies/all/:page', function(req, res, next) {
//   return movieController.all(req, res);
// });
//
// router.get("/potato", function(req, res, next) {
//   return movieController.potato(req, res);
// });

module.exports = router;
