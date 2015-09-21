var express = require('express');
var router = express.Router();

var Rental = require('../models/rental'),
    rental = new Rental();

var Movie = require('../models/movie'),
    movie = new Movie();

var RENTAL_PERIOD = 5; // 5 days

router.post('/checkout/:customer_id/:movie_id', function(req, res, next) {
  // Add check for if there is an available movie for checkout:
  // query db to count # of rentals with that movie id
  // TODO: check only returned = false

  // compareWithInventory
  // respondToCall
  // -> either send error message or execute checkout based on answer

  // 

  var movie_id = req.params.movie_id;

  function countCheckedOutMovies(movie_id) {
    var count;
    rental.where(['movie_id', 'returned'], [movie_id, 'false'], function(err, rows) {
      console.log(rows);
      count = rows.length;
    });
    return count;
  }

  console.log(countCheckedOutMovies(movie_id));

  // var rented_movies = function(next) { 
  //   movie.where(['id', 'returned'], [movie_id, 'false'], function(err, rows) {
  //     next(rows);
  //   }); 
  // }

  // // check movie record to get inventory
  // var relevant_movie = movie.find_by('id', movie_id, function(err, row) {
  //   row;
  // });

  // var inventory = relevant_movie[0].inventory;
  // console.log(inventory);
  // // compare # of rentals with inventory
  // if (rented_movies_count >= inventory) {
  //   // if inventory <= rentals, return message NO
  //   res.status(403).json({ error: "There are no available copies of that movie for rental." })
  // } else {
  //   // else proceed with checkout
  //   var values = [];
  //   values.push(req.params.customer_id);
  //   values.push(movie_id);

  //   var checkout_date = new Date();
  //   var return_date = new Date();
  //   return_date.setDate(return_date.getDate() + RENTAL_PERIOD);

  //   var defaults = [checkout_date, return_date, "false"];
  //   values = values.concat(defaults);

  //   var columns = ['customer_id', 'movie_id', 'checkout_date', 'return_date', 'returned'];

  //   rental.create(columns, values, function(err, res) {
  //     res.status(200).json(res);
  //   });
  // }

  // async.series([rented_movies, ])
});

module.exports = router;
