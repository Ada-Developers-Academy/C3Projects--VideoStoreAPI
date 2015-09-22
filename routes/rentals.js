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

router.get('/:title', function(request, response, next) {
  var title = request.params.title;
  var rentedCount, inventory;
  var customerIdList = [];
  var movieObject = {};

  async.waterfall([
    // query db for movie
    function(callback) {
      movie.find_by('title', title, function(error, row) {
        movieObject.movie = row;
        inventory = row.inventory;
        callback(null, inventory, movieObject);
      });
    },
    // retrieve rental records for that movie
    function(movieInventory, movieObject, callback) {
      rental.where(['movie_id', 'returned'], 
        [movieObject.movie.id, 'false'], function(error, rows) {
          callback(null, movieInventory, rows, movieObject);
      });
    },
    // get count of rentals
    function(movieInventory, rentals, movieObject, callback) {
      // check how many copies of that movie are checked out
      rentedCount = rentals.length;
      callback(null, movieInventory, rentedCount, rentals, movieObject);
    },
    // calculate availability
    function(movieInventory, rentedCount, rentals, movieObject, callback) {
      var availableBool = (rentedCount < movieInventory) ? true : false;
      var availableCount = (rentedCount < movieInventory) ? (movieInventory - rentedCount) : 0;
      movieObject.availability = {
        available: availableBool,
        copiesAvailable: availableCount
      };
      callback(null, rentals, movieObject);
    },
    // turn object of rentals into array of ids
    function(rentals, movieObject, callback) {
      for (var i = 0; i < rentals.length; i++) {
        customerIdList.push(rentals[i].customer_id);
      }
      callback(null, customerIdList, movieObject);
    },
    // query DB for full customer data
    // parameter is movieObject with movie and availability objects
    function(customerIDs, movieObject, callback) {
      customer.where_in('id', customerIDs, function(error, rows) {
        movieObject.currentRenters = rows;
        callback(null, movieObject);
      });
    }
  ], function(error, result) {
    response.status(200).json(result);
  });
});

router.post('/checkout/:customer_id/:movie_id', function(request, response, next) {
  var movie_id = request.params.movie_id;
  var count, inventory, enoughInventory;

  async.waterfall([
    // count total # of checked out copies of movie with id, movie_id
    function(callback) {
      rental.where(['movie_id', 'returned'], [movie_id, 'false'], function(err, rows) {
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
        var return_date = new Date();
        return_date.setDate(return_date.getDate() + RENTAL_PERIOD);

        var defaults = [checkout_date, return_date, "false"];
        values = values.concat(defaults);

        var columns = ['customer_id', 'movie_id', 'checkout_date', 'return_date', 'returned'];

        rental.create(columns, values, function(err, results) {
          response.status(200).json({ success: "Yay! You checked out a movie." });
        });
      }
  });
});

module.exports = router;
