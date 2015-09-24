"use strict";

var Rental = require('../rentals');
var rental = new Rental();

exports.rentalsController = {

  all_rentals: function all_rentals(req, res) {
    var rentals = rental.all_rentals(function(rentals) {
      return res.status(200).json(rentals);
    });
  },

  overdue: function overdue(req, res) {
    rental.overdue(function(overdue) {
      return res.status(200).json(overdue);
    });
  },

  check_out: function check_out(req, res) {
    rental.check_out(req.body, function(check_out) {
      return res.status(200).json(check_out);
    });
  },

  check_in: function check_in(req, res) {
    rental.check_in(req.body, function(check_in) {
      return res.status(200).json(check_in);
    });
  }

}
