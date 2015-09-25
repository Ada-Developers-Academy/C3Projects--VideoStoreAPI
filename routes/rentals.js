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
      if (rows) {
        return res.status(200).json({ overdue_customers: rows });
      } else {
        return res.status(400).json({ error: "No overdue customers were found." });
      }
    });
  });
});

router.get('/:title', function(request, response, next) {
  var title = request.params.title;
  var rentedCount;
  var customerIdList = [];
  var movieObject = {};

  // query db for movie and get inventory
  movie.find_by('title', title, function(error, row) {
    movieObject.movie_data = row;
    title = title.charAt(0).toUpperCase() + title.slice(1);

    if (row == undefined) {
      return response.status(400).json({ error: title + " was not found."});
    }

    // retrieve rental records for that movie
    rental.where(['movie_id', 'returned_date'], [movieObject.movie_data.id, ''], function(error, rows) {
      // turn object of rentals into array of ids
      for (var i = 0; i < rows.length; i++) {
        customerIdList.push(rows[i].customer_id);
      }

      rentedCount = customerIdList.length;
      var inventory = movieObject.movie_data.inventory;
      var availableBool = (rentedCount < inventory) ? true : false;
      var availableCount = (rentedCount < inventory) ? (inventory - rentedCount) : 0;
      movieObject.availability = { available: availableBool, copies_available: availableCount }

      customer.where_in('id', customerIdList, function(error, rows) {
        movieObject.current_renters = rows;
        response.status(200).json(movieObject);
      });
    });
  });
});

router.post('/checkout/:customer_id/:movie_title', function(request, response, next) {
  var customer_id = request.params.customer_id;
  var movie_title = request.params.movie_title;
  var count, inventory, enoughInventory, movie_id, account_credit;

  movie.find_by('title', movie_title, function(err, row) {
    movie_id = row.id;

    // count total # of checked out copies of movie with id, movie_id
    rental.where(['movie_id', 'returned_date'], [movie_id, ''], function(err, rows) {
      movieCount = rows.length;

      // check if enough inventory of movie is available (true/false)
      movie.find_by('id', movie_id, function(err, row) {
        // don't need inventory, could call row.inventory on line 29
        inventory = row.inventory;
        enoughInventory = (movieCount < inventory) ? true : false;

        // if result, which equals enoughInventory, is false, return message NO
        if (enoughInventory == false) {
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
            customer.find_by('id', customer_id, function(err, row) {
              account_credit = row.account_credit;
              var new_credit = account_credit - 100;
              customer.update(customer_id, ['account_credit'], [new_credit], function(err, results) {
                response.status(200).json({ success: "Yay! You checked out " + movie_title });
              });
            });
          });
        }
      });
    });
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
        res.status(200).json({ success: message + movieTitle });
      })
    });
  });
});


module.exports = router;
