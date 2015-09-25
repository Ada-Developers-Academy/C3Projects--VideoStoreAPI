"use strict";

var Rental = require('../models/rental');

function titleSpaces(title) {
  return title.replace("_", " ");
}

exports.rentalsController = {
  find_movie: function find_movie(req, res, movie_title) {

    movie_title = titleSpaces(movie_title);
    var rental = new Rental();


    rental.movie_details(movie_title, function(err, record) {
      res.status(200).json({ movie_details: record });
    })
  },

  find_customers: function find_customers(req, res, movie_title) {

    movie_title = titleSpaces(movie_title);
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

    movie_title = titleSpaces(movie_title);
    var rental = new Rental();

    // check availablity in movies table first
    rental.check_movie_availability(movie_title, function(err, record) {
      if (record[0].available > 0) {
        console.log("we're getting somewhere");

        movie_title = titleSpaces(movie_title);
        //nested function inception :(

         // change available in movies table
        rental.update_availabile_movies(movie_title, function(err, record) {
          // insert new rental into rental table
          rental.create_rental(movie_title, customer_id, function(err, record)
            // charge customer and update customer table
           {rental.charge_customer(customer_id, function(err, record) {
            res.status(200).json({ new_rental: "You've successfully charged the customer." });
            });
          });
        });

      } else {
       // fail everything. die.
       res.status(200).json({ new_rental: "Sorry, something went wrong." });
      }
    })

  },

  check_in: function check_in(req, res, customer_id, movie_title) {

    movie_title = titleSpaces(movie_title);

    var rental = new Rental();


    // update the movie's available column
    rental.check_movie_in(movie_title, function(err, record) {
      // update today's date to return Date
      movie_title = titleSpaces(movie_title);

      res.status(200).json({ new_rental: "You've successfully updated the availability." });

      rental.update_return_date(customer_id, movie_title, function(err, record) {
      });

    })

  }
}
