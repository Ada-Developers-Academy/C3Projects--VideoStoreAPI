var express = require('express');
var router = express.Router();
var movies_exports = require('../controllers/movies');

/* GET */
router.get('/', function(req, res, next) {
  // res.render('movies', { title: 'Express' });
  return movies_exports.moviesController.movies(req, res);
});

/* GET */
router.get('/:title', function(req, res, next) {
  // res.render('movies', { title: 'Express' });
  return movies_exports.moviesController.movies_by_title(req, res);
});

router.get('/release/:release_date', function(req, res, next) {
  // res.render('movies', { title: 'Express' });
  return movies_exports.moviesController.movies_by_release(req, res);
});

module.exports = router;
