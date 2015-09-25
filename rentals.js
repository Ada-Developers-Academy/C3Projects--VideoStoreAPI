"use-strict";
var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

function Rental() {
  this.table_name = "rentals";
}

Rental.prototype = require('./database');

Rental.prototype.all_rentals = function(callback) {
  var newDate = new Date();
  var today = this.formatDate(newDate);
  var db = new sqlite3.Database('db/' + db_env + '.db');

  db.exec("BEGIN; \
  UPDATE rentals SET overdue=1 WHERE due_date < " + today + " \
  AND check_in IS NULL; \
  COMMIT;", function() {
    db.all(
      "SELECT * FROM rentals", function(err, res) {
        if (callback) { callback(res); }
      });
  });

  db.close();
};

Rental.prototype.rental_log = function(movie_title, callback) {
  movie_title = movie_title.toLowerCase();
  var capitalize_title = movie_title[0].toUpperCase() + movie_title.substring(1);
  this.query("SELECT * FROM rentals WHERE movie_title ='" + capitalize_title + "';", function(res) {
    callback(res);
  });
};

Rental.prototype.overdue = function(callback) {
  var newDate = new Date();
  var today = this.formatDate(newDate);
  var db = new sqlite3.Database('db/' + db_env + '.db');

  db.exec("BEGIN; \
  UPDATE rentals SET overdue=1 WHERE due_date < " + today + " \
  AND check_in IS NULL; \
  COMMIT;", function() {
    db.all(
      "SELECT customers.id, customers.name, customers.registered_at, \
      customers.address, customers.city, customers.state, \
      customers.postal_code, customers.phone, customers.account_credit \
      FROM customers, rentals \
      WHERE customers.id=rentals.customer_id \
      AND rentals.overdue=1 AND rentals.check_in IS NULL;", function(err, res) {
        if (callback) { callback(res); }
      });
  });

  db.close();
};

Rental.prototype.check_out = function(data, callback) {
// passing req.body to data
  // data will be an object with a key value pair with each item for rental
  var check_out_date = new Date();
  var check_out = this.formatDate(check_out_date);
  var due_date = new Date(check_out_date);
  due_date.setDate(check_out_date.getDate() + 3);
  var due = this.formatDate(due_date);
  var title = data.movie_title;
  var customer_id = data.customer_id;

  var db = new sqlite3.Database('db/' + db_env + '.db');
  db.exec(
  "BEGIN; \
  INSERT INTO " + this.table_name + "(check_out, check_in, due_date, overdue, movie_title, customer_id) \
  VALUES(" + check_out + ", null, " + due + ", 0, '" + title + "', " + customer_id +  "); \
  UPDATE movies SET inventory_available=inventory_available - 1 WHERE title='" + title + "'; \
  UPDATE customers SET account_credit=account_credit - 3 WHERE id=" + customer_id + "; \
  COMMIT;", function(err) {
    if(callback) { callback(err); }
    db.close();
  });
};

Rental.prototype.check_in = function(data, callback) {
// data will include movie_title and customer_id
  var check_in_date = new Date();
  var check_in = this.formatDate(check_in_date);
  var title = data.movie_title;
  var customer_id = data.customer_id;

  var db = new sqlite3.Database('db/' + db_env + '.db');
  db.exec(
  // update rental: check_in_date and overdue
  // update movie: inventory_available
    "BEGIN; \
    UPDATE rentals SET check_in=" + check_in + ", overdue=0 WHERE movie_title='" + title + "'; \
    UPDATE movies SET inventory_available=inventory_available + 1 WHERE title='" + title + "'; \
    COMMIT;", function(err) {
      if(callback) { callback(err); }
      db.close();
    });
};


module.exports = Rental;
