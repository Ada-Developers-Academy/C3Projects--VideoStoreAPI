"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

var Database = {
  find_all: function(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + ";";

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  by_column: function(column, number, page, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + " ORDER BY " + column + " LIMIT " + number + " OFFSET " + page + ";";

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  // Called by Movies controller:
  customers_by_movie_current: function(title, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // all customers who currently have the movie checked out
    var statement = "SELECT 'customers'.* FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE rentals.movie_id = (SELECT movies.id FROM movies WHERE movies.title = ? COLLATE NOCASE LIMIT 1) AND rentals.checked_out = 'true'; ";

    db.all(statement, title, function(err, rows) {
      callback(err, rows);
      db.close();
    });
  },

  movie_info: function(title, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // information about specified movie
    var statement = "SELECT 'movies'.* FROM movies where movies.title = ? COLLATE NOCASE LIMIT 1; ";

    db.all(statement, title, function(err, rows) {
      callback(err, rows);
      db.close();
    });
  },

  customers_by_movie_history: function(title, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // all customers who have checked out this movie in the past
    var statement = "SELECT 'customers'.* FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE rentals.movie_id = (SELECT movies.id FROM movies WHERE movies.title = ? COLLATE NOCASE LIMIT 1) AND rentals.checked_out = 'false'; ";

    db.all(statement, title, function(err, rows) {
      callback(err, rows);
      db.close();
    });
  },

  customers_by_movie_history_sorted: function(title, table, column, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // all customers who have checked out specified movie in the past sorted by specified column

    var statement = "SELECT * FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE rentals.movie_id = (SELECT movies.id FROM movies WHERE movies.title = ? COLLATE NOCASE LIMIT 1) AND rentals.checked_out = 'false' ORDER BY " + table + "." + column + ";";

    db.all(statement, title, function(err, rows) {
      callback(err, rows);
      db.close();
    });
  },

  // Called by Customers controller:
  movies_by_customer_current: function(customer_id, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // all movies currently checked out by that customer
    var statement = "SELECT 'movies'.* FROM movies INNER JOIN rentals ON movies.id = rentals.movie_id WHERE rentals.customer_id = (SELECT customers.id FROM customers WHERE customers.id = ? COLLATE NOCASE LIMIT 1) AND rentals.checked_out = 'true'; ";

    db.all(statement, customer_id, function(err, rows) {
      callback(err, rows);
      db.close();
    });
  },

  movies_by_customer_history: function(customer_id, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // all movies checked out by that customer in the past
    var statement = "SELECT 'movies'.*, rentals.checkout_date, rentals.return_date FROM movies INNER JOIN rentals ON movies.id = rentals.movie_id WHERE rentals.customer_id = (SELECT customers.id FROM customers WHERE customers.id = ? COLLATE NOCASE LIMIT 1) AND rentals.checked_out = 'false' ORDER BY rentals.checkout_date; ";

    db.all(statement, customer_id, function(err, rows) {
      callback(err, rows);
      db.close();
    });
  },

  customers_overdue: function(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // all customers who currently have the movie checked out
    var statement = "SELECT * FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE date(rentals.return_date) < date('now') AND rentals.checked_out = 'true'; ";

    db.all(statement, function(err, rows) {
      callback(err, rows);
      db.close();
    });
  },
};

module.exports = Database;
