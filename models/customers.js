"use strict";

var sqlite3 = require("sqlite3").verbose(),
    db_env = process.env.DB || 'development';

function Customer() {
  this.table_name = "customers";
}

Customer.prototype = require('../database');

Customer.prototype.find_checked_out = function(id, callback) {
  var db = new sqlite3.Database('db/' + db_env + '.db');
  var currently_checked_out_movies_statement =
    "SELECT * FROM rentals WHERE customer_id = " + id +
    " AND check_in_date = \"\";";
  var returned_movies_statement =
    "SELECT * FROM rentals WHERE customer_id = " + id +
    " AND check_in_date != \"\";";

  db.all(currently_checked_out_movies_statement, function(err, res1) {
    db.all(returned_movies_statement, function(err, res2) {
      var result = {
        "checked_out_movies": res1,
        "returned_movies": res2
      };
      if (callback) callback(err, result);

      db.close();
    });
  });
};

Customer.prototype.find_by_sorted = function(sort_by, number, pages, callback) {
  var db = new sqlite3.Database('db/' + db_env + '.db');
  var offset = (pages - 1) * number;
  var statement = "SELECT * FROM customers ORDER BY " + sort_by + "ASC LIMIT " + number + "OFFSET" + offset + ";";

  // id  1-10 - page 1   1 * 10 = 10  if 1: show no offset
  // id 11-20 - page 2   2 * 10 = 20  if 2: ((2 - 1) * 10) = 10
  // id 21-30 - page 3   3 * 10 = 30  if 3: ((3 - 1) * 10) = 20
  // id 31-40 - page 4   4 * 10 = 40

  // id 1-7 - page 1
  // id 8-14 - page 2   1 * 7 = 7

  db.all(statement, function(err, res) {
    if (callback) callback(err, res);
    db.close();
  });
};

module.exports = Customer;
