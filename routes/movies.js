var express = require('express');
var router = express.Router();

var Movie = require('../models/movie'),
    movie = new Movie();

router.get('/', function(req, res, next) {
  movie.find_all(function(err, rows) {
    res.status(200).json({ movies: rows });
  });
});

module.exports = router;
