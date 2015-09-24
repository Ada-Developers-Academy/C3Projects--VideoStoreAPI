var express = require('express');
var router  = express.Router();
// var async   = require('async');

var Customer = require('../models/customer'),
    customer = new Customer();

var Rental = require('../models/rental'),
    rental = new Rental();

var Movie = require('../models/movie'),
    movie = new Movie();

router.get('/', function(req, res, next) {
  customer.find_all(function(err, rows) {
    res.status(200).json({ customers: rows });
  });
});

router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  var customer_info;
  // var pastRentalsObject = {};

  var customerObject = {
    customer_data: undefined,
    movies: {}
  }

  customer.find_by('id', id, function(err, row) {
    customerObject.customer_data = row;

    // use where to pull all records that meet the condition
    rental.where(["customer_id"], [id], function(err, rows) {
      var currentMoviesIDs = [];
      var pastMoviesIDs = [];
      var pastMovies = {};

      for (var i = 0; i < rows.length; i++) {
        // currently checked out movies
        if (rows[i].returned_date == "") {
          currentMoviesIDs.push(rows[i].movie_id);
        // returned movies
        } else {
          pastMovies[rows[i].movie_id] = { 
            dates: {
              returned_date: rows[i].returned_date,
              checkout_date: rows[i].checkout_date 
            }
          };

          pastMoviesIDs.push(rows[i].movie_id);
        }
      }

      movie.where_in('id', currentMoviesIDs, function(err, rows) {
        customerObject.movies.currentRentals = rows; // no returned_date
        pastMoviesArray = [];

        movie.where_in('id', pastMoviesIDs, function(err, rows) { // unsorted
          for (var i = 0; i < rows.length; i++) {
            pastMovies[rows[i].id].movie_data = rows[i];
            pastMoviesArray.push(pastMovies[rows[i].id]);
          }

          pastMoviesArray.sort(function(a, b) {
              return a.dates.checkout_date.localeCompare(b.dates.checkout_date); // this is a good way to sort strings!
            });
          
          customerObject.movies.pastRentals = pastMoviesArray;
          res.status(200).json(customerObject);
        });
      });
    });
  });
});

router.get('/:sort_by/:limit/:offset', function(req, res, next) {
  var values = [];
  values.push(req.params.limit);
  values.push(req.params.offset);
  var column = req.params.sort_by;

  customer.subset(column, values, function(err, rows) {
    res.status(200).json({ customers: rows} );
  });
});

router.post('/create/:name/:registered_at/:address/:city/:state/:postal_code/:phone', function(req, res, next) {
  var values = [];
  values.push(req.params.name);
  values.push(req.params.registered_at);
  values.push(req.params.address);
  values.push(req.params.city);
  values.push(req.params.state);
  values.push(req.params.postal_code);
  values.push(req.params.phone);
  var columns = ['name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone']

  customer.create(columns, values, function(err, res) {
    res.status(200).json(res);
  });
});

module.exports = router;
