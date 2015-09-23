var async = require('async');

var express = require('express');
var router = express.Router();

var Movie = require('../models/movie'),
    movie = new Movie();

var Customer = require('../models/customer'),
    customer = new Customer();

  var Rental = require('../models/rental'),
    rental = new Rental();

router.get('/', function(req, res, next) {
  movie.find_all(function(err, rows) {
    res.status(200).json({ movies: rows });
  });
});

router.get('/:title', function(req, res, next) {
  var title = req.params.title;
  var currentRentersArray = [];
  var pastRentersArray = [];

  var movieObject = { 
    movie_data: undefined, 
    customers: { currentRenters: currentRentersArray, pastRenters: pastRentersArray } 
  };
  var movieId;

  movie.find_by('title', title, function(err, row) {
    movieObject.movie_data = row;
    movieId = row.id;

    rental.where(['movie_id'], [movieId], function(err, rows) {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].returned == "false") {
          movieObject.customers.currentRenters.push(rows[i]);
        } else {
          movieObject.customers.pastRenters.push(rows[i]);
        }
      }

      res.status(200).json(movieObject);
    });
  });
});

router.get('/:sort_by/:limit/:offset', function(req, res, next) {
  var queries = [];
  queries.push(req.params.limit);
  queries.push(req.params.offset);
  var column = req.params.sort_by;

  movie.subset(column, queries, function(err, rows) {
    res.status(200).json({ movies: rows} );
  });
});

module.exports = router;
