"use strict";

var Rental = require('../rentals');
var rental = new Rental();

exports.rentalsController = {

  all: function all(req, res) {
    var rentals = rental.all(function(rentals) {
      return res.status(200).json(rentals);
    });
  },

  overdue: function overdue(req, res) {
    rental.overdue(function(overdue) {
      return res.status(200).json(overdue);
    });
  }
}
