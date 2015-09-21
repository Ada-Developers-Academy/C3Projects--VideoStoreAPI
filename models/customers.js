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

module.exports = Customer;
