"use-strict";
var sqlite3 = require('sqlite3').verbose();

function Customer() {
  this.table_name = "customers";
}

Customer.prototype = require('./database');

Customer.prototype.current_rentals = function(id, callback) {
  // list of current rentals out based on customer id
  this.query("SELECT * FROM rentals WHERE customer_id=" + id + " AND check_in IS NULL;", function(res) {
    callback(res);
  });
};

Customer.prototype.past_rentals = function(id, callback) {
  // list of past rentals based on customer id
  this.query("SELECT * FROM rentals WHERE customer_id=" + id + " AND check_in IS NOT NULL ORDER BY check_out" + ";", function(res) {
    callback(res);
  });
};

module.exports = Customer;
