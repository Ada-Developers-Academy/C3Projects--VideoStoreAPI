var async = require('async');
var express = require('express');
var router = express.Router();

var Rental = require('../models/rental'),
    rental = new Rental();

var Movie = require('../models/movie'),
    movie = new Movie();

var Customer = require('../models/customer'),
    customer = new Customer();

var RENTAL_PERIOD = 5; // 5 days

var today = new Date();

router.get('/overdue', function(req, res, next) {
  var overdueCustomerIds = [];

  rental.where(['returned_date'], [''], function(err, rows) {
    for (var i = 0; i < rows.length; i++) {
      var dueDate = new Date(rows[i].due_date);
      if (dueDate < today) { // overdue!
        overdueCustomerIds.push(rows[i].customer_id);
      }
    }

    customer.where_in("id", overdueCustomerIds, function(err, rows) {
      res.status(200).json({ overdue_customers: rows });
    });
  });
});

router.get('/:title', function(request, response, next) {
  var title = request.params.title;
  var rentedCount;
  var customerIdList = [];
  var movieObject = {};

  async.waterfall([
    // query db for movie and get inventory
    function(callback) {
      movie.find_by('title', title, function(error, row) {
        movieObject.movie_data = row;
        callback(null);
      });
    },
    // retrieve rental records for that movie
    function(callback) {
      rental.where(['movie_id', 'returned_date'], 
        [movieObject.movie_data.id, ''], function(error, rows) {
          // turn object of rentals into array of ids
          for (var i = 0; i < rows.length; i++) {
            customerIdList.push(rows[i].customer_id);
          }
          callback(null);
      });
    },
    // get count of rentals
    function(callback) {
      // check how many copies of that movie are checked out
      rentedCount = customerIdList.length;
      var inventory = movieObject.movie_data.inventory;

      var availableBool = (rentedCount < inventory) ? true : false;
      var availableCount = (rentedCount < inventory) ? (inventory - rentedCount) : 0;
      movieObject.availability = {
        available: availableBool,
        copiesAvailable: availableCount
      };
      callback(null);
    },
    // query DB for full customer data
    function(callback) {
      customer.where_in('id', customerIdList, function(error, rows) {
        movieObject.currentRenters = rows;
        callback(null, movieObject);
      });
    }
  ], function(error, result) {
    response.status(200).json(result);
  });
});

router.post('/checkout/:customer_id/:movie_title', function(request, response, next) {
  var movie_title = request.params.movie_title;
  var count, inventory, enoughInventory, movie_id;

  async.waterfall([
    function(callback) {
      movie.find_by('title', movie_title, function(err, row) {
        movie_id = row.id;
        callback(null);
      });
    },
    // count total # of checked out copies of movie with id, movie_id
    function(callback) {
      rental.where(['movie_id', 'returned_date'], [movie_id, ''], function(err, rows) {
        count = rows.length;
        callback(null, count);
      });
    },
    // check if enough inventory of movie is available (true/false)
    function(movieCount, callback) {
      movie.find_by('id', movie_id, function(err, row) {
        // don't need inventory, could call row.inventory on line 29
        inventory = row.inventory;
        enoughInventory = (movieCount < inventory) ? true : false;
        callback(null, enoughInventory);
      });
    }
  ], function(err, result) {
      // if result, which equals enoughInventory, is false, return message NO
      if (result == false) {
        response.status(403).json({ error: "There are no available copies of that movie for rental." });
      } else {  // proceed with checkout
        var values = [];
        values.push(request.params.customer_id);
        values.push(movie_id);

        var checkout_date = new Date();
        var due_date = new Date();
        due_date.setDate(due_date.getDate() + RENTAL_PERIOD);

        var defaults = [checkout_date, due_date, ""];
        values = values.concat(defaults);

        var columns = ['customer_id', 'movie_id', 'checkout_date', 'due_date', 'returned_date'];

        rental.create(columns, values, function(err, results) {
          response.status(200).json({ success: "Yay! You checked out a movie." });
        });
      }
  });
});

router.put('/checkin/:customer_id/:movie_title', function(req, res, next) {
  var customerId = req.params.customer_id;
  var movieTitle = req.params.movie_title;
  var movieId;

  // retrieve rental record which corresponds to customer id and movie title,
  // AND which is not already returned

  // translate movie title to movie id
  movie.find_by("title", movieTitle, function(err, row) {
    movieId = row.id;
    var columns = ["customer_id", "movie_id", "returned_date"];
    var values = [customerId, movieId, ""];

    rental.where(columns, values, function(err, rows) {
      var rentalId = rows[0].id;

      var message = "Congratulations, you have checked in: ";

      rental.update(rentalId, ["returned_date"], [today], function(err, result) {
        res.status(200).json(message + movieTitle);
      })
    });
  });
});


module.exports = router;
