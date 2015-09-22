"use strict";

// var sqlite3 = require('sqlite3').verbose(); // currently unused

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
  var statement = 'SELECT customers.id AS customers_id, customers.name, rentals.id FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE rentals.movie_title LIKE ? AND rentals.return_date = "";';
  var values = movieTitle;

  db.all(statement, values, function(err, rows) {
    callback(err, rows);
    db.close();
  });
}

module.exports = Movie;
