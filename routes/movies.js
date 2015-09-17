var express = require('express');
var router = express.Router();
var movie_exports = require('../controllers/movies');

router.get('/zomg', function(req, res, next) {
  return movie_exports.moviesController.movies(req, res);
});

router.get('/', function(req, res, next) {
  return movie_exports.moviesController.all(req, res);
});

module.exports = router;
