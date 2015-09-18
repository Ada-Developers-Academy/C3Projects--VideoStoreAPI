var express = require('express');
var router = express.Router();
var movies_exports = require('../controller/movies');

// route is '/movies'
router.get('/', function(req, res, next) {
  return movies_exports.moviesController.all_movies(req, res);
});

module.exports = router;
