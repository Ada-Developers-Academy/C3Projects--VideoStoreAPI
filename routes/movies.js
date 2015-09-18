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

router.get('/:sort_by/:limit/:offset', function(req, res, next) {
  var queries = [];
  queries.push(req.params.limit);
  queries.push(req.params.offset);
  var column = req.params.sort_by;

  console.log(queries);

  movie.subset(column, queries, function(err, rows) {
    res.status(200).json({ movies: rows} );
  });
});

module.exports = router;
