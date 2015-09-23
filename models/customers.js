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

Customer.prototype.find_by_sorted_date = function(sort_by, number, pages, callback) {
  var db = new sqlite3.Database('db/' + db_env + '.db');
  var statement = "SELECT * FROM customers;";

  db.all(statement, function(err, res) {
    if (number && pages) {
      // var offset = (pages - 1) * number;

      var sorted = res.sort(function(a, b){
        return new Date(a.registered_at) - new Date(b.registered_at)
      });
      // sorted[offset]
      // sorted[i]
      // var select = []
      //
      // var selection = Array.apply(null, Array(number)).map(function (_, i) {return offset + i;});
      // for (var i = selection[0]; i < (selection[0] + selection.length); i++) {
      //   select.push(sorted[i]);
      // }
      //
      // console.log(select);
    }
    else {
      var sorted = res.sort(function(a, b){
        return new Date(a.registered_at) - new Date(b.registered_at)
      });
      // console.log(sorted);
    }

    if (callback) callback(err, sorted);
    db.close();
  });
};

module.exports = Customer;
