"use strict";
var express = require('express');
var router = express.Router();
var movies_exports = require('../controllers/movies')

/* GET all movies */
router.get('/', function(req, res, next) {
  return movies_exports.moviesController.findAllMovies(req, res);
});

/* GET movie by title */
router.get('/:title', function(req, res, next) {
  return movies_exports.moviesController.findMovieByTitle(req, res);
});

/* SORT MOVIES BY TITLE alphabetically */
router.get('/sort/title/:limit/:offset', function(req, res, next) {
  return movies_exports.moviesController.sortMoviesByTitle(req, res)
});

/* SORT MOVIES BY release_date */
router.get('/sort/release_date/:limit/:offset', function(req, res, next) {
  return movies_exports.moviesController.sortMoviesByReleaseDate(req, res)
});


router.get('/:title/customers/current', function(req, res, next) {
  console.log(res);
  return movies_exports.moviesController.currentCustomerRentals(req, res)
});

/* SHOWS INVENTORY OF AVAILABLE MOVIES */
router.get('/:title/available', function(req, res, next) {
  return movies_exports.moviesController.availableMovies(req, res)
});

module.exports = router;
// title?page=:page&number=:number
