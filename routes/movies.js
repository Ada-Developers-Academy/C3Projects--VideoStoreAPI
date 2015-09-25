var express = require('express');
var router = express.Router();
var movie_exports = require('../controllers/movies');

// GET /movies
router.get('/', function(req, res, next) {
  movie_exports.moviesController.getAllMovies(res);
});

// GET /movies/:id(synopsis, inventory, release_date)
router.get('/id/:id', function(req, res, next) {
  movie_exports.moviesController.getMovieById(req.params.id, res);
});

// GET /movies/:title/inventory
router.get('/title/:title/inventory', function(req, res, next){
  movie_exports.moviesController.getMovieByTitleInventory(req.params.title, res);
});

// GET /movies/title/:title
router.get('/title/:title', function(req, res, next) {
  movie_exports.moviesController.getMovieByTitle(req.params.title, res);
});

// GET /movies/release_date?n=XXX&p=XXX
router.get('/release_date', function(req, res, next){
  movie_exports.moviesController.getMoviesByReleaseDate(req.query.n, req.query.p, res);
});

// GET /movies/title?n=XXX&p=XXX
router.get('/title', function(req, res, next){
  movie_exports.moviesController.getMoviesByTitle(req.query.n, req.query.p, res);
});

// GET /movies/title/:title/checked_out_current
router.get('/title/:title/checked_out_current', function(req, res, next){
  movie_exports.moviesController.getCheckedOutCustomersByTitle(req.params.title, res);
});

// GET /movies/:title/checked_out_history?ordered_by=XXX
// ordered_by id, name, check out date
router.get('/title/:title/checked_out_history', function(req, res, next){
  movie_exports.moviesController.getCheckedOutHistoryByTitle(req.params.title, req.query.ordered_by, res);
});

module.exports = router;
