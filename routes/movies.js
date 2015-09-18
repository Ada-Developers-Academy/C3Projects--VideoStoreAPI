var express = require('express');
var router = express.Router();

var Movie = require('../models/movie'),
    movie = new Movie();

router.get('/', function(req, res, next) {
  movie.find_all(function(err, rows) {
    res.status(200).json({ movies: rows });
  });
});

router.get('/:title', function(req, res, next) {
  var title = req.params.title;

  movie.find_by('title', title, function(err, row) {
    res.status(200).json({ movie: row} );
  });
});

module.exports = router;
