var express = require('express');
var router = express.Router();
var movie_copies_exports = require('../controllers/movie_copies');

/* GET MOVIE ROUTES */
router.get('/', function(req, res, next) {
  // res.render('movies', { title: 'Express' });
  return movie_copies_exports.movie_copiesController.copies(req, res);
});

module.exports = router;
