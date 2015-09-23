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

router.get('/:title/:order', function(req, res, next) {
  var title = req.params.title;
  var originalOrder = req.params.order;
  console.log(originalOrder);
  // sort by customer_id, customer name, and checkout_date
  // var currentRentersArray = [];
  // var pastRentersArray = [];

  var movieObject = { 
    movie_data: undefined, 
    customers: { currentRenters: undefined, pastRenters: undefined } 
  };
  var movieId;

  movie.find_by('title', title, function(err, row) {
    movieObject.movie_data = row;
    movieId = row.id;
    var sortOrder;

    var condition = "movie_id = " + movieId;

    // don't bother sorting rentals if customers should be sorted by customer name
    if (originalOrder == "customer_name") {
      sortOrder = "none"
    } else {
      sortOrder = originalOrder;
    }
    console.log(sortOrder);

    rental.order_by(condition, sortOrder, function(err, rows) {
      var currentRentersIds = [];
      var pastRentersIds = [];

      console.log(rows);
      for (var i = 0; i < rows.length; i++) {

        if (rows[i].returned_date == "") {
          currentRentersIds.push(rows[i].customer_id);
        } else {
          pastRentersIds.push(rows[i].customer_id);
        }
      }

      customer.where_in(['id'], currentRentersIds, function(err, rows) {
        movieObject.customers.currentRenters = rows;

        customer.where_in(['id'], pastRentersIds, function(err, rows) {
          if (originalOrder == "customer_name") {
            rows.sort(function(a, b) {
              return a.name.localeCompare(b.name); // this is a good way to sort strings!
            }); // sort customers by names ASC
          }
          movieObject.customers.pastRenters = rows;
          
          res.status(200).json(movieObject);
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
