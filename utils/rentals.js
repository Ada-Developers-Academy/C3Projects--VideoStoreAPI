"use strict";

var customers = require('./customers');
var movies = require('./movies');
var rentals = [];

for(var i = 0; i < customers.length; i++) {
  var customer = customers[i];
  // assuming our db creates these in over
  // looking for the ID (which doesn't include 0)
  var movie1_id = Math.floor(Math.random() * movies.length) + 1;
  var movie2_id = Math.floor(Math.random() * movies.length) + 1;
  var movie3_id = Math.floor(Math.random() * movies.length) + 1;
  // using it for the INDEX (which starts at 0)
  var movie1 = movies[movie1_id - 1];
  var movie2 = movies[movie2_id - 1];
  var movie3 = movies[movie3_id - 1];

  var current_rental = {
    "customer_id": customer.id,
    "name": customer.name,
    "movie_id": movie1_id,
    "title": movie1.title,
    "checkout_date": "2015-09-19",
    "due_date": "3016-09-19",
    "return_date": null
  }

  rentals.push(current_rental);

  var past_rental = {
    "customer_id": customer.id,
    "name": customer.name,
    "movie_id": movie2_id,
    "title": movie2.title,
    "checkout_date": "2014-09-09",
    "due_date": "2014-09-16",
    "return_date": "2014-09-10"
  }

  rentals.push(past_rental);

  var overdue_rental = {
    "customer_id": customer.id,
    "name": customer.name,
    "movie_id": movie3_id,
    "title": movie3.title,
    "checkout_date": "2014-09-19",
    "due_date": "2014-09-26",
    "return_date": null
  }

  rentals.push(overdue_rental);
}

module.exports = rentals;
