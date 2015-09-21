"use strict";

var Rentals = require('../rentals');
var rental = new Rental();

exports.rentalsController = {

  all: function all(req, res) {
    var rentals = rental.all(function(rentals) {
      return res.status(200).json(rentals);
    });
  },

  rental_info: function(movie_title, callback) {
    // list of past rentals based on customer id
    this.query("SELECT * FROM rentals WHERE customer_id=" + id + " AND check_in IS NOT NULL ORDER BY check_out" + ";", function(res) {
      callback(res);
    });
  }
}
