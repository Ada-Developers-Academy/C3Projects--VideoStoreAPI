"use strict";

function Movie() {
  this.table_name = "movies";

}

Movie.prototype = require('../database');

Movie.prototype.getCurrentRentalCustomer = function(movieDb, rentalDb, customerDb, title, callback) {
  getMovieId(movieDb, title, function(error, movie_id) {
    getCustomerIdCurrent(rentalDb, movie_id[0].id, function(error, rentalInstances) {
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

Movie.prototype.getPastRentalCustomer = function(movieDb, rentalDb, customerDb, title, sort, callback) {
  getMovieId(movieDb, title, function(error, movieId) {
    getCustomerIdPast(rentalDb, movieId[0].id, function(error, rentalInstances) {
      var customers = [];
      for (var i = 0; i < rentalInstances.length; i++) {
        getCustomer(customerDb, rentalInstances[i].customer_id, function(error, customerInstance) {
          customers.push(customerInstance[0]);
          if (customers.length == rentalInstances.length) {
            if (sort == "sort_by_id") {
              callback(error, sortById(customers));
            }
            else if (sort == "sort_by_name") {
              callback(error, sortByName(customers));
            }
          }
        });
      }
    });
  });
}

function sortById(array) {
  array.sort(function(a, b) {
    if (a.id > b.id) {
      return 1;
    }
    if (a.id < b.id) {
      return -1;
    }
    return 0;
  });
  return array;
}

function sortByName(array) {
  array.sort(function(a, b) {
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    }
    return 0
  })

  return array;
}

function getMovieId(instance, title, callback) {
  instance.find_by("title", title, function(error, result) {
    callback(error, result);
  })
}

function getCustomerIdCurrent(instance, movieId, callback) {
  instance.current_checkout_rentals("movie_id", movieId, function(error, result) {
    callback(error, result);
  })
}

function getCustomerIdPast(instance, movieId, callback) {
  instance.past_checkout_rentals("movie_id", movieId, function(error, result) {
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


