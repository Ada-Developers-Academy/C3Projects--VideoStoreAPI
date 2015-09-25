"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

function Customer() {
  this.table_name = "customers";
}

Customer.prototype = require('../database');
// Customer.prototype.

  // Called by Customers controller:
Customer.prototype.movies_by_customer_current = function(customer_id, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // all movies currently checked out by that customer
    var statement = "SELECT 'movies'.* FROM movies INNER JOIN rentals ON movies.id = rentals.movie_id WHERE rentals.customer_id = (SELECT customers.id FROM customers WHERE customers.id = ? COLLATE NOCASE LIMIT 1) AND rentals.checked_out = 'true'; ";

    db.all(statement, customer_id, function(err, rows) {
      callback(err, rows);
      db.close();
    });
  },

Customer.prototype.movies_by_customer_history = function(customer_id, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // all movies checked out by that customer in the past
    var statement = "SELECT 'movies'.*, rentals.checkout_date, rentals.return_date FROM movies INNER JOIN rentals ON movies.id = rentals.movie_id WHERE rentals.customer_id = (SELECT customers.id FROM customers WHERE customers.id = ? COLLATE NOCASE LIMIT 1) AND rentals.checked_out = 'false' ORDER BY rentals.checkout_date; ";

    db.all(statement, customer_id, function(err, rows) {
      callback(err, rows);
      db.close();
    });
  },

Customer.prototype.customers_overdue = function(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // all customers who currently have the movie checked out and past return_date
    var statement = "SELECT * FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE date(rentals.return_date) < date('now') AND rentals.checked_out = 'true' ORDER BY rentals.return_date; ";

    db.all(statement, function(err, rows) {
      callback(err, rows);
      db.close();
    });
  },

module.exports = Customer;
