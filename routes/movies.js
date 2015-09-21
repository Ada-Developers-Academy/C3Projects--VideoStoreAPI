var express = require('express');
var router = express.Router();
var movie_exports = require('../controllers/movies');

router.get('/', function(req, res, next) {
  return movie_exports.moviesController.all(req, res);
});

router.get('/release_date_sort/:records_per_page/:offset', function(req, res, next){
  return movie_exports.moviesController.release_date_sort(req, res);
});

router.get('/title_sort/:records_per_page/:offset', function(req, res, next){
  return movie_exports.moviesController.title_sort(req, res);
});

router.get('/:title', function(req, res, next) {
  return movie_exports.moviesController.movie_info(req, res);
});

router.get('/:title/current_customers', function(req, res, next) {
  return movie_exports.moviesController.current_customers(req, res);
});

module.exports = router;
