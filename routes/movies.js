var express = require('express');
var router = express.Router();

var movie_exports = require('../controllers/movies');

/* GET home page. */
router.get('/', function(req, res, next) {
  //return list of all movies
  return movie_exports.moviesController.index(req, res);
});

router.get('/one_movie', function(req, res, next) {
  // return one customer based on title
  //return customer_exports.customerController.one_customer(req, res);
});

router.get('/:column', function(req, res, next) {
  // return subsets of movies, might be two different endpoints
return movie_exports.moviesController.subset(req, res, req.params.column);
});

// one movies/title/customers will return customer info
// another movie/title will return movie info


module.exports = router;
