"use-strict";
var sqlite3 = require('sqlite3').verbose();

function Movie() {
  this.table_name = "movies";
}

Movie.prototype = require('./database');

Movie.prototype.movie_info = function(movie_title, callback) {
  this.query("SELECT * FROM " + this.table_name + " WHERE title LIKE '%" + movie_title + "%';", function(res) {
    callback(res);
  });
};

Movie.prototype.current_customers = function(movie_title, callback) {
  this.query("SELECT customers.id, customers.name, customers.registered_at, \
              customers.address, customers.city, customers.state, \
              customers.postal_code, customers.phone, customers.account_credit \
              FROM customers, rentals \
              WHERE customers.id=rentals.customer_id \
              AND rentals.movie_title LIKE '%" + movie_title + "%' \
              AND rentals.check_in IS NULL;", function(res) {
    callback(res);
  });
};

Movie.prototype.past_customers = function(movie_title, callback) {
  this.query("SELECT customers.id, customers.name, customers.registered_at, \
              customers.address, customers.city, customers.state, \
              customers.postal_code, customers.phone, customers.account_credit \
              FROM customers, rentals \
              WHERE customers.id=rentals.customer_id \
              AND rentals.movie_title LIKE '%" + movie_title + "%' \
              AND rentals.check_in IS NOT NULL;", function(res) {
    callback(res);
  });
};

Movie.prototype.past_customers_sort = function(movie_title, sort_type, callback) {
  this.query("SELECT customers.id, customers.name, customers.registered_at, \
              customers.address, customers.city, customers.state, \
              customers.postal_code, customers.phone, customers.account_credit \
              FROM customers, rentals \
              WHERE customers.id=rentals.customer_id \
              AND rentals.movie_title LIKE '%" + movie_title + "%' \
              AND rentals.check_in IS NOT NULL \
              ORDER BY " + sort_type + ";", function(res) {
     callback(res);
   });
 };

module.exports = Movie;
