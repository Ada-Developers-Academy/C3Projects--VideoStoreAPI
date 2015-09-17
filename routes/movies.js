var express = require('express');
var router = express.Router();
var movies_exports = require('../controllers/movies');

/* GET */
router.get('/', function(req, res, next) {
  // res.render('movies', { title: 'Express' });
  return movies_exports.moviesController.movies(req, res);
});

module.exports = router;
