"use strict";

var sqlite3 = require("sqlite3").verbose(),
  db_env = process.env.DB || 'development';

module.exports = {
  find_by: function(column, value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + " WHERE " + column + " = ?;";

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  find_all: function(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + ";";

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  sort_by: function(column, limit, offset, callback){
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + " ORDER BY " + column + " LIMIT " + limit + " OFFSET " + offset + ";";

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  available: function(value, callback){
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT title, available FROM " + this.table_name + " WHERE title = ?;";

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  current_checkout_rentals: function(column, value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM rentals WHERE " + column + " = ? AND returned_date = 'nil';";


    db.all(statement, value, function(error, result) {

      if (callback) callback(error, result);
      db.close();
    })
  },

  past_checkout_rentals: function(column, value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM rentals WHERE " + column + " = ? AND returned_date != 'nil';";

    db.all(statement, value, function(error, result) {
      if (callback) callback(error, result);
      db.close();
    })
  },

  past_checkout_rentals_by_date: function(value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT name, registered_at, address, city, state, postal_code, phone, account_credit, checkout_date FROM customers, rentals WHERE customers.id = rentals.customer_id AND rentals.movie_id = " + value +" AND rentals.returned_date != 'nil' ORDER BY checkout_date DESC;";

    db.all(statement, function(error, result) {
      if (callback) callback(error, result);
      db.close();
    })
  },

  past_rentals_by_customer: function(value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT title, checkout_date, returned_date FROM movies, rentals where movies.id = rentals.movie_id and rentals.returned_date != 'nil' and rentals.customer_id = " + value + " ORDER BY checkout_date DESC;";

    db.all(statement, function(error, result) {
      console.log(statement);
      if (callback) callback(error, result);
      console.log(result);
      db.close();
    })
  },

  create_rental: function(data, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "INSERT INTO rentals (checkout_date, returned_date, rental_time, \
                    cost, total, customer_id, movie_id) \
                    VALUES (?, ?, ?, ?, ?, ?, ?);";

    var values = []
    values.push(data.checkout_date);
    values.push(data.returned_date);
    values.push(data.rental_time);
    values.push(data.cost);
    values.push(data.total);
    values.push(data.customer_id);
    values.push(data.movie_id);

    db.run(statement, values, function(err) {
      callback(err, res);
      db.close();
    });
  },

  customersRentalHistory: function(callback){
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT name, checkout_date, returned_date, rental_time FROM customers, rentals WHERE customers.id = rentals.customer_id ORDER BY checkout_date DESC;"; //[ { customer_id: 1 }, { customer_id: 2 }, { customer_id: 3 }, { customer_id: 4 } ]
    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  }
}
