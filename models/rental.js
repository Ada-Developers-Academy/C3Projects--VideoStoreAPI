"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var date_format = require('../helpers/date_helper');

function Rental() {
  this.table_name = "rentals";
}

Rental.prototype = {
  check_out: function(customer_id, movie_title, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db'),
      rental_duration_days = 7,
      checkout_date = date_format(0),
      return_date = date_format(rental_duration_days),
      rental_cost = 1.0,
      inserted_rental_id,
      number_of_records_changed = 0;

    var begin_statement = "BEGIN IMMEDIATE;"

    var create_statement = "INSERT INTO " + this.table_name + " (checkout_date, return_date, movie_id, customer_id, checked_out) " + "VALUES ('" + checkout_date + "', '" + return_date  + "', (SELECT id FROM movies WHERE title = '" + movie_title + "' AND num_available >= 1), " + customer_id + ", 'true');";

    var availability_statement = "UPDATE movies SET num_available = (num_available - 1) WHERE id = (SELECT id FROM movies WHERE title = '" + movie_title + "' AND num_available >= 1);";

    var charge_statement = "UPDATE customers SET account_credit = (account_credit - " + rental_cost + ") WHERE ID = " + customer_id + " AND account_credit >= 1.0;";

    var zero_statement = "UPDATE customers SET account_credit = 0.0 WHERE id = " + customer_id + " AND account_credit < 1.0;";

    db.serialize(function(err) {
      // db.exec("BEGIN IMMEDIATE;");

      db.exec(begin_statement + create_statement + availability_statement +     charge_statement + zero_statement + "COMMIT;", function(error) {
        // inserted_rental_id = this.lastID;
        // number_of_records_changed = this.changes;
        if (callback) {
          if (error) {
            callback(error, { error: error, result: "Unsuccessful request. There may not be any copies of that movie available."  });
          } else {
            callback(error, { result: "Successful check out" });
          }
        }
        db.close();
      });

    });
  },

  check_in: function(customer_id, movie_title, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db'),
      return_date = date_format(0),
      changes = 0;

    var update_statement = "UPDATE " + this.table_name + " SET return_date = '" + return_date + "', checked_out = 'false' WHERE movie_id = (SELECT id FROM movies WHERE title = '" + movie_title + "') AND customer_id = " + customer_id + " AND checked_out = 'true';";

    var availability_statement = "UPDATE movies SET num_available = (num_available + 1) WHERE id = (SELECT id FROM movies WHERE title = '" + movie_title + "');";

    db.serialize(function(err) {
      db.exec("BEGIN IMMEDIATE");
      db.run(update_statement, function(err) {
        changes = this.changes;
      });

      if (changes === 0) {
        err = { error: "Check in did not occur. Please make sure that the movie was checked out." } ;
      } else {
        db.run(availability_statement);
      }

      db.exec("COMMIT;", function(error) {
        if (callback) {
          if (err) { error = err; }
          callback(error, { movie: movie_title, customer_id: customer_id, checked_in_on: return_date, number_of_records_changed: changes });
        }
      });

      db.close();
    });
  }
};

module.exports = Rental;
