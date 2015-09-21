var express = require('express');
var router = express.Router();
var movies_exports = require('../controllers/movies');

/* GET MOVIE ROUTES */
router.get('/', function(req, res, next) {
  return movies_exports.moviesController.movies(req, res);
});

router.get('/:title', function(req, res, next) {
  return movies_exports.moviesController.movies_by_title(req, res);
});

router.get('/:title/current_renters', function(req, res, next) {
  return movies_exports.moviesController.current_renters_by_title(req, res);
});

router.get('/release/:release_date', function(req, res, next) {
  return movies_exports.moviesController.movies_by_release(req, res);
});

module.exports = router;
