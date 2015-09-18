var express = require('express');
var router = express.Router();
var movies_exports = require('../controllers/movies')

/* GET home page. */
router.get('/', function(req, res, next) {
  return movies_exports.moviesController.index(req, res);
});
// sort by movie title
router.get('/title/:records/:offset', function(req, res, next) {
  return movies_exports.moviesController.title(req, res);
});

// sort by movie release date
router.get('/released/:records/:offset', function(req, res, next) {
  return movies_exports.moviesController.released(req, res);
});

// for specific movie, show all customers w/ it checkout out
router.get('checkedout/:title', function(req, res, next) {
  return movies_exports.moviesController.checkedout(req, res);
});
// all customers w/ specific movie checked out in past
// default show sorted by check out date??
router.get('/history/:title', function(req, res, next) {
  return movies_exports.moviesController.title_history(req, res);
});
// for movie, sort check out history by customer id
router.get('/history/id/:title', function(req, res, next) {
  return movies_exports.moviesController.id_history(req, res);
});
// for movie, sort check out history by customer name
router.get('/history/name/:title', function(req, res, next) {
  return movies_exports.moviesController.name_history(req, res);
});


module.exports = router;
