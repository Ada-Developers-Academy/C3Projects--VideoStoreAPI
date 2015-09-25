"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

function Movie() {
  this.table_name = "movies";
}

Movie.prototype = require('../database');

// Movie.prototype - extend to validation functions (e.g., is_a_movie)

Movie.prototype.movie_info = function(title, callback) {
  var db = new sqlite3.Database('db/' + db_env + '.db');
  // information about specified movie
  var statement = "SELECT 'movies'.* FROM movies where movies.title = ? COLLATE NOCASE LIMIT 1; ";

  db.all(statement, title, function(err, rows) {
    callback(err, rows);
    db.close();
  });
};

Movie.prototype.customers_by_movie_current = function(title, callback) {
  var db = new sqlite3.Database('db/' + db_env + '.db');
  // all customers who currently have the movie checked out
  var statement = "SELECT 'customers'.* FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE rentals.movie_id = (SELECT movies.id FROM movies WHERE movies.title = ? COLLATE NOCASE LIMIT 1) AND rentals.checked_out = 'true'; ";

  db.all(statement, title, function(err, rows) {
    callback(err, rows);
    db.close();
  });
};

Movie.prototype.customers_by_movie_history= function(title, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // all customers who have checked out this movie in the past
    var statement = "SELECT 'customers'.* FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE rentals.movie_id = (SELECT movies.id FROM movies WHERE movies.title = ? COLLATE NOCASE LIMIT 1) AND rentals.checked_out = 'false'; ";

    db.all(statement, title, function(err, rows) {
      callback(err, rows);
      db.close();
    });
  },


Movie.prototype.customers_by_movie_history_sorted = function(title, table, column, callback) {
  var db = new sqlite3.Database('db/' + db_env + '.db');
  // all customers who have checked out specified movie in the past sorted by specified column

  var statement = "SELECT * FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE rentals.movie_id = (SELECT movies.id FROM movies WHERE movies.title = ? COLLATE NOCASE LIMIT 1) AND rentals.checked_out = 'false' ORDER BY " + table + "." + column + ";";

  db.all(statement, title, function(err, rows) {
    callback(err, rows);
    db.close();
  });
};

module.exports = Movie;
