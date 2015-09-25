var express = require('express');
var router = express.Router();

var movie_exports = require('../controllers/movies');

/* GET home page. */
router.get('/', function(req, res, next) {
  //return list of all movies
  return movie_exports.moviesController.index(req, res);
});

//movies/:title/past_rentals/:column
router.get('/:movie_title/past_rentals/:column', function(req, res, next) {
  return movie_exports.moviesController.past_rentals(req, res, req.params.movie_title, req.params.column);
});


//movies/:title/current_rentals
router.get('/:movie_title/current_rentals', function(req, res, next) {
  return movie_exports.moviesController.current_rentals(req, res, req.params.movie_title);
});


// movies/name/1
router.get('/:column/page:number', function(req, res, next) {
  return movie_exports.moviesController.subset(req, res, req.params.column, req.params.number);
});

// one movies/title/customers will return customer info
// another movie/title will return movie info


module.exports = router;
