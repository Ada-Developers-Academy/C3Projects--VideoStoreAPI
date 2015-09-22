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

    var create_statement = "INSERT INTO " + this.table_name + " (checkout_date, return_date, movie_id, customer_id, checked_out) " + "VALUES ('" + checkout_date + "', '" + return_date  + "', (SELECT id FROM movies WHERE title = '" + movie_title + "'), " + customer_id + ", 'true')";

    var charge_statement = "UPDATE customers SET account_credit = (account_credit - 1.0) WHERE ID = " + customer_id + " ;";

    db.run(create_statement, function(err) {
      callback(err, { inserted_id: this.lastID, changed: this.changes });
      db.close();
    });

    db.run(charge_statement, function(err) {
      callback(err, { changed: this.changes });
      db.close();
    });
  }
};

module.exports = Rental;
