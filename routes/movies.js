var express = require('express');
var router = express.Router();
var movies_exports = require('../controller/movies');

// '/movies'
router.get('/', function(req, res, next) {
  return movies_exports.moviesController.all_movies(req, res);
});

// '/movies/:sort_by/:results_per_page/:page_number'
// :sort_by - :title, :release_date
router.get('/:sort_by/:results_per_page/:page_number', function(req, res, next) {
  return movies_exports.moviesController.sort_pages(req, res);
});

// '/movies/:title'
router.get('/:title', function(req, res, next) {
  return movies_exports.moviesController.search_title(req, res);
});



module.exports = router;
