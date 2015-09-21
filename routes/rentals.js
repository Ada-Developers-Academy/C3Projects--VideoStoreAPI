var express = require('express');
var router = express.Router();

var rental_exports = require('../controllers/rentals');

router.get('/:movie_title', function(req, res, next) {
  //return list of all movies
  return rental_exports.rentalsController.find_movie(req, res, req.params.movie_title);
});

module.exports = router;
