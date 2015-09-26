"use strict";

function Movie() {
  this.tableName = 'movies';
  this.columnNames = [
    'id', // INTEGER PRIMARY KEY
    'title', // TEXT NOT NULL UNIQUE
    'overview', // TEXT
    'release_date', // TEXT
    'inventory' // INTEGER NOT NULL DEFAULT 0
  ];
}

// this is silly-ish, but necessary because of how we set up the DB object
Movie.prototype = require('./database').prototype;

Movie.prototype.customersCurrent = function customersCurrent(movieTitle, callback) {
  var db = this.openDB();
  var statement = 'SELECT customers.id AS customers_id, customers.name, rentals.id AS rental_id, rentals.checkout_date FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE rentals.movie_title LIKE ? AND rentals.return_date = "";';
  var values = movieTitle;

  db.all(statement, values, function(err, rows) {
    callback(err, rows);
    db.close();
  });
}

Movie.prototype.customersPast = function customersPast(movieTitle, parameter, callback) {
  var db = this.openDB();

  // There is a security gap here with putting the parameter directly into the statement without a check that it is a valid sort parameter.

  var statement = 'SELECT customers.id AS customer_id, customers.name, rentals.id AS rental_id, rentals.checkout_date FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE rentals.movie_title LIKE ? AND rentals.return_date != "" ORDER BY ' + parameter + ';';
  var values = [movieTitle];

  db.all(statement, values, function(err, rows) {
    callback(err, rows);
    db.close();
  });
}

Movie.prototype.numAvail = function numAvail(movieTitle, callback) {
  var statement = 'SELECT (SELECT inventory FROM movies WHERE title LIKE ?) - (SELECT COUNT(return_date) FROM rentals WHERE return_date = "" AND movie_title LIKE ?) AS num_available;'
  var values = [movieTitle, movieTitle];

  var db = this.openDB();
  db.all(statement, values, function(err, rows) {
    callback(err, rows);
    db.close();
  });
}

module.exports = Movie;
