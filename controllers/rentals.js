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
  },

  new_rental: function new_rental(req, res, customer_id, movie_title) {

    var rental = new Rental();

    // check availablity in movies table first
    rental.check_movie_availability(movie_title, function(err, record) {
      if (record[0].available > 0) {
        console.log("we're getting somewhere");

        // insert new rental into rental table
        rental.create_rental(movie_title, customer_id, function(err, record) {
          console.log("Maybe there's something in the database! Go check.")
        });

      // charge customer and update customer table
      // change inventory and available in movies table
      } else {
       // fail everything. die.
       console.log("wahaaaaaa");
      }
    })

  }
}
