var express = require('express');
var router  = express.Router();

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

router.get('/:title/:order', function(req, res, next) {
  var title = req.params.title;
  var order = req.params.order;

  var movieObject = { 
    movie_data: undefined, 
    customers: { } 
  };

  var movieId;

  movie.find_by('title', title, function(err, row) {
    movieObject.movie_data = row;
    movieId = row.id;

    rental.where(["movie_id"], [movieId], function(err, rows) {
      var currentRentersIds = [];
      var pastRentersIds = [];
      var pastRenters = {};

      for (var i = 0; i < rows.length; i++) {

        if (rows[i].returned_date == "") {
          currentRentersIds.push(rows[i].customer_id);
        } else {
          var checkoutDate = new Date(rows[i].checkout_date);
          pastRenters[rows[i].customer_id] = { 
            dates: {
              checkout_date: checkoutDate
            }
          };

          pastRentersIds.push(rows[i].customer_id);
        }
      }

      customer.where_in('id', currentRentersIds, function(err, rows) {
        movieObject.customers.current_renters = rows;
        var pastRentersArray = [];

        customer.where_in('id', pastRentersIds, function(err, rows) {
          for (var i = 0; i < rows.length; i++) {
            pastRenters[rows[i].id].customer_data = rows[i];
            pastRentersArray.push(pastRenters[rows[i].id]);
          }

          // now sort the array by name, id or checkout date
          if (order == "name") {
            pastRentersArray.sort(function(a, b) {
              return a.customer_data.name
                      .localeCompare(b.customer_data.name);
            });
          } else if (order == "id") {
            pastRentersArray.sort(function(a, b) {
              return a.customer_data.id - b.customer_data.id;
            });
          } else if (order == "checkout_date") {
            pastRentersArray.sort(function(a, b) {
              return a.dates.checkout_date - b.dates.checkout_date;
            });
          } else {
            var error_message = "You cannot sort by: " + order;
          }

          movieObject.customers.past_renters = pastRentersArray;
          
          if (error_message) {
            res.status(400).json(error_message);
          } else {
            res.status(200).json(movieObject);
          }
        });
      });
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
