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


/*

GET /movies/title?n=XXX&p=XXX

GET /movies/release_date?n=XXX&p=XXX

GET /movies/:title/checked_out_current

GET /movies/:title/checked_out_history?ordered_by=XXX
  // ordered_by
    // - id
    // - name
    // - check out date
*/

module.exports = router;
