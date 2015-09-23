"use strict";
var Movie = require("../models/movie.js");
var Rental = require("../models/rental");
var Customer = require("../models/customer");

exports.moviesController = {
  findAllMovies: function(req, res) {
    var dbMovie = new Movie();
    dbMovie.find_all(function(err,result){
    res.status(200).json(result);
    });
  },

  findMovieByTitle: function(req, res) {
    var dbMovie = new Movie();
    var value = req.params.title;
    console.log(value);
    dbMovie.find_by("title", value, function(err,result){
    res.status(200).json(result);
    });
  },

  sortMoviesByTitle: function(req, res) {
    var dbMovie = new Movie();
    var limit = req.params.limit;
    var offset = req.params.offset;
    dbMovie.sort_by("title", limit, offset, function(err,result){
    res.status(200).json(result);
    });
  },

  sortMoviesByReleaseDate: function(req, res) {
    var dbMovie = new Movie();
    var limit = req.params.limit;
    var offset = req.params.offset;
    dbMovie.sort_by("release_date", limit, offset, function(err,result){
    res.status(200).json(result);
    });
  },

  currentCustomerRentals: function(req, res) {
    var dbMovie = new Movie();
    var dbRental = new Rental();
    var dbCustomer = new Customer();
    var title = req.params.title;
    dbMovie.getCurrentRentalCustomer(dbMovie, dbRental, dbCustomer, title, function(error, result) {
      console.log(result);
      res.status(200).json(result);
    });

    // dbMovie.find_by("title", title, function getMovieId(error, result) {
    //   var movieId = result[0].id;
    //   console.log(result);
    //   dbRental.current_checkout_rentals("movie_id", movieId, function getCustomerId(error, result) {
    //     var customerId = result[0].customer_id;
    //     console.log(result)
    //     dbCustomer.find_by("id", customerId, function getCustomer(error, result) {
    //       res.status(200).json(result);
    //     });
    //   });

    // });
    //   console.log(result[0].customer_id)
    // });
    //   return res.status(200).json(result);
    // });

  },

  pastCustomerRentals: function(req, res) {
    var dbMovie = new Movie();
    var dbRental = new Rental();
    var dbCustomer = new Customer();
    var title = req.params.title;
    var regex = /[^\/]+$/
    var sort = regex.exec(req.url)
    console.log(req.url)
    dbMovie.getPastRentalCustomer(dbMovie, dbRental, dbCustomer, title, sort[0], function(error, result) {
      console.log(result);
      res.status(200).json(result);
    });

  },

  availableMovies: function(req, res) {
    var dbMovie = new Movie();
    var title = req.params.title;
    dbMovie.available(title, function(err,result){
    res.status(200).json(result);
    });
  }
}
