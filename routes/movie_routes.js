"use strict";

var express = require('express');
var router = express.Router();
var movieController = require("../controllers/movies_controller");

// GET all movies
router.get('/all', function(req, res, next) {
  return movieController.all(req, res);
});

// GET all movies sorted by release_date or title
router.get("/all/sort_by=:sort/:page", function(req, res, next) {
  var sorting_hat = ['all_by_release_date', 'all_by_title'];
  var sort = 'all_by_' + req.params.sort; // .all_by_release_date

  if (sorting_hat.indexOf(sort) != -1) {
    return movieController[sort](req, res);
  } else {
   return movieController.all(req, res);
  }
});

router.get('/all/:page', function(req, res, next) {
  return movieController.all(req, res);
});
// GET a single movie profile
router.get('/:title', function(req, res, next) {
  return movieController.title(req, res);
});

// GET a list of customers that have rented movie title
router.get('/:title/renting', function(req, res, next) {
  return movieController.whos_renting(req, res);
});

router.get('/:title/rented/sort_by=:query', function(req, res, next) {
  var sorters = [
    'rentals_by_customer_id',
    'rentals_by_customer_name',
    'rentals_by_check_out_date'
  ];

  var sort = 'rentals_by_' + req.params.query;  //"rentals_by_customer_id"

  if (sorters.indexOf(sort) != -1) {
    return movieController[sort](req, res);
  } else {
    return movieController.all(req, res);
  }
});

module.exports = router;
