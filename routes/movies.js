var express = require('express');
var router = express.Router();
var movies_exports = require('../controllers/movies');

/* GET /movies */
router.get('/', function(req, res, next) {
  return movies_exports.moviesController.index(req, res);
});

/* GET /movies/:column/:n/:p */
router.get('/:column/:n/:p', function(req, res, next) {
  return movies_exports.moviesController.by_column(req, res);
});

/* GET /movies/:title/customers */
router.get('/:title/customers', function(req, res, next) {
  return movies_exports.moviesController.customers_by_movie_current(req, res);
});

/* GET /movies/:title */
router.get('/:title', function(req, res, next) {
  return movies_exports.moviesController.movie_info(req, res);
});

/* GET /movies/:title/history */
router.get('/:title/history', function(req, res, next) {
  return movies_exports.moviesController.customers_by_movie_history(req, res);
});

module.exports = router;
