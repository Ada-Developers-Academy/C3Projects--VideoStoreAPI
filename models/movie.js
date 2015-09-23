"use strict";

function Movie() {
  this.table_name = "movies";

}

Movie.prototype = require('../database');

Movie.prototype.getRentalCustomer = function(movieDb, rentalDb, customerDb, title, callback) {
  getMovieId(movieDb, title, function(error, movie_id) {
    getCustomerId(rentalDb, movie_id[0].id, function(error, rentalInstances) {
      var customers = []
      for (var i = 0; i < rentalInstances.length; i++) {
        getCustomer(customerDb, rentalInstances[i].customer_id, function(error, customerInstance) {
          customers.push(customerInstance[0]);
          if (customers.length == rentalInstances.length) {
            callback(error, customers);
          }
        });
      }
    });
  });
}

function getMovieId(instance, title, callback) {
  instance.find_by("title", title, function(error, result) {
    callback(error, result);
  })
}

function getCustomerId(instance, movieId, callback) {
  instance.current_checkout_rentals("movie_id", movieId, function(error, result) {
    callback(error, result);
  })

}

function getCustomer(instance, customerId, callback) {
  instance.find_by("id", customerId, function(error, result) {
    callback(error, result);
  })
}


// var movie = new Movie();
// movie.find_by("title", "Jaws", function(err, res){});
// movie.find_all(function(err, res){});
// movie.sort_by("title", 30, 1, function(err, res){});
module.exports = Movie;


