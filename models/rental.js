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
    var checkout_date_dd = checkout_date.getDate();
    var checkout_date_mm = checkout_date.getMonth() + 1;
    var checkout_date_yyyy = checkout_date.getFullYear();
    if(checkout_date_dd < 10) { checkout_date_dd ='0'+ checkout_date_dd }
    if(checkout_date_mm < 10) { checkout_date_mm ='0'+ checkout_date_mm }
    checkout_date = checkout_date_yyyy + "-" + checkout_date_mm + "-" + checkout_date_dd;

    var return_date = new Date(Date.now() + (rental_duration_days * 24 * 60 * 60 * 1000));
    var return_date_dd = return_date.getDate();
    var return_date_mm = return_date.getMonth() + 1;
    var return_date_yyyy = return_date.getFullYear();
    if(return_date_dd < 10) { return_date_dd ='0'+ return_date_dd }
    if(return_date_mm < 10) { return_date_mm ='0'+ return_date_mm }
    return_date = return_date_yyyy + "-" + return_date_mm + "-" + return_date_dd;

    var rental_cost = 1.0;

    var create_statement = "INSERT INTO " + this.table_name + " (checkout_date, return_date, movie_id, customer_id, checked_out) " + "VALUES ('" + checkout_date + "', '" + return_date  + "', (SELECT id FROM movies WHERE title = '" + movie_title + "'), " + customer_id + ", 'true')";
    var charge_statement = "UPDATE customers SET account_credit = (account_credit - " + rental_cost + ") WHERE id = " + customer_id + " ;";
    var availability_statement = "UPDATE movies SET num_available = (num_available - 1) WHERE id = (SELECT id FROM movies WHERE title = '" + movie_title + "');";

    db.serialize(function(err) {
      db.run(create_statement, function(err) {
        callback(err, { inserted_rental_id: this.lastID, movie: movie_title, customer_id: customer_id, checked_out_on: checkout_date, due_on: return_date, number_of_records_changed: this.changes });
      });
      db.run(charge_statement);
      db.run(availability_statement);

      db.close();
    });
  },

  check_in: function(customer_id, movie_title, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var return_date = new Date(Date.now());

    var update_statement = "UPDATE " + this.table_name + " SET return_date = '" + return_date + "', checked_out = 'false' WHERE movie_id = (SELECT id FROM movies WHERE title = '" + movie_title + "') AND customer_id = " + customer_id + ";";

    var availability_statement = "UPDATE movies SET num_available = (num_available + 1) WHERE id = (SELECT id FROM movies WHERE title = '" + movie_title + "');";
    db.serialize(function(err) {
      db.run(update_statement, function(err) {
        callback(err, { movie: movie_title, customer_id: customer_id, checked_in_on: return_date, number_of_records_changed: this.changes });
      });
      db.run(availability_statement);

      db.close();
    });
  },

  format_date: function(days_to_add, callback) {
    var today = new Date(Date.now());
    var today_dd = today.getDate();
    var today_mm = today.getMonth() + 1;
    var today_yyyy = today.getFullYear();
    if(today_dd < 10) { today_dd ='0'+ today_dd; }
    if(today_mm < 10) { today_mm ='0'+ today_mm; }
    today = today_yyyy + "-" + today_mm + "-" + today_dd;
    callback(today);
  }
};

module.exports = Rental;
