var async = require('async');
var express = require('express');
var router = express.Router();

var Rental = require('../models/rental'),
    rental = new Rental();

var Movie = require('../models/movie'),
    movie = new Movie();

var RENTAL_PERIOD = 5; // 5 days

router.post('/checkout/:customer_id/:movie_id', function(req, res, next) {
  var movie_id = req.params.movie_id;
  var count, inventory, enoughInventory;

  async.waterfall([
    // count total # of checked out copies of movie with id, movie_id
    function(callback) {
      rental.where(['movie_id', 'returned'], [movie_id, 'false'], function(err, rows) {
        count = rows.length;
        callback(null, count);
      })
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
        res.status(403).json({ error: "There are no available copies of that movie for rental." });
      } else {  // proceed with checkout
        var values = [];
        values.push(req.params.customer_id);
        values.push(movie_id);

        var checkout_date = new Date();
        var return_date = new Date();
        return_date.setDate(return_date.getDate() + RENTAL_PERIOD);

        var defaults = [checkout_date, return_date, "false"];
        values = values.concat(defaults);

        var columns = ['customer_id', 'movie_id', 'checkout_date', 'return_date', 'returned'];

        rental.create(columns, values, function(err, results) {
          res.status(200).json({ success: "Yay! You checked out a movie." });
        });
      }
  });
});

module.exports = router;
