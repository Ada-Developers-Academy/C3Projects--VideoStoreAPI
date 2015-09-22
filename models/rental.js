"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

function Rental() {
  this.table_name = "rentals";
}

// Rental.prototype = require('../database');
Rental.prototype = {
  check_out: function(customer_id, movie_title, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var rental_duration_days = 7;
    var checkout_date = new Date(Date.now());
    var return_date = new Date(Date.now() + (rental_duration_days * 24 * 60 * 60 * 1000));

    var statement = "INSERT INTO " + this.table_name + " (checkout_date, return_date, movie_id, customer_id, checked_out) " + "VALUES ('" + checkout_date + "', '" + return_date  + "', (SELECT id FROM movies WHERE title = '" + movie_title + "'), " + customer_id + ", 'true');";
    console.log(statement);

    db.run(statement, function(err) {
      callback(err, { inserted_id: this.lastID, changed: this.changes });
      db.close();
    });
  }
};

module.exports = Rental;
