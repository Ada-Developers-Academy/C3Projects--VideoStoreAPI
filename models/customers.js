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
    " AND check_in_date IS NULL;";
  var returned_movies_statement =
    "SELECT * FROM rentals WHERE customer_id = " + id +
    " AND check_in_date IS NOT NULL;";

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
  var statement;
  if (number && pages) {
    var offset = (pages - 1) * number;
    statement = "SELECT * FROM customers ORDER BY " + sort_by + " ASC LIMIT " + number + " OFFSET " + offset + ";";
  }
  else {
    statement = "SELECT * FROM customers ORDER BY " + sort_by + " ASC;";
  }

  db.all(statement, function(err, res) {
    if (callback) callback(err, res);
    db.close();
  });
};

module.exports = Customer;
