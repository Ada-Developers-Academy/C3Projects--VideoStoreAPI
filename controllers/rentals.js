"use strict";

var Rental = require('../models/rental');

exports.rentalsController = {
  find_movie: function find_movie(req, res, movie_title) {

    var rental = new Rental();

    rental.movie_details(movie_title, function(err, record) {
      res.status(200).json({ movie_details: record });
    })
  },

  find_customers: function find_customers(req, res, movie_title) {

    var rental = new Rental();

    rental.customers(movie_title, function(err, record) {
      res.status(200).json({ rental_customers: record });
    })
  },

  overdue_customers: function overdue_customers(req, res) {

    var rental = new Rental();

    rental.overdue(function(err, record) {
      res.status(200).json({ overdue_customers: record });
    })
  }
}
