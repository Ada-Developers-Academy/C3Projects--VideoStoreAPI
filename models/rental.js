"use strict";

function Rental() {
  this.tableName = "rentals";
  this.columnNames = [
    'id', // INTEGER PRIMARY KEY
    'checkout_date', // TEXT NOT NULL DEFAULT CURRENT_DATE
    'return_date', // TEXT
    'movie_title', // TEXT NOT NULL // FOREIGN KEY(movie_title) REFERENCES movies(title)
    'customer_id' // INTEGER NOT NULL // FOREIGN KEY(customer_id) REFERENCES customers(id)
  ];
}

Rental.prototype = require('./database').prototype;

Rental.prototype.checkOut = function(data, callback) {
  var db = this.openDB();
  var keys = Object.keys(data);
  var questionMarks = [];
  var values = [];

  for (var i = 0; i < keys.length; i++) {
    values.push(data[keys[i]]);
    questionMarks.push("?");
  }

  var insertStatement = 'INSERT INTO rentals (' + keys.join(', ') + ') VALUES (' + questionMarks.join(', ') + ');';
  var updateStatement = 'UPDATE customers SET account_balance = (account_balance - 250) WHERE id = ?;';
  db.serialize(function checkoutMovie() {
    var res = {};
    db.run('BEGIN TRANSACTION;');

    db.run(insertStatement, values, function updateRes(err) {
      res.insertedRentalID = this.lastID;
      res.changes = res.changes ? (res.changes + this.changes) : this.changes;
    });

    db.run(updateStatement, [data.customer_id], function updateRes(err) {
      res.customerID = parseInt(data.customer_id);
      res.changes = res.changes ? (res.changes + this.changes) : this.changes;
    });

    db.run('COMMIT TRANSACTION;', function createCallback(err) {
      if (err) {
        callback(err, { insertedID: null, changed: null });
      } else {
        callback(err, res);
      }
      db.close();
    });
  });
}

Rental.prototype.checkIn = function(movie_title, date, callback) {
  var db = this.openDB();
  var statement = "UPDATE rentals SET return_date = ? WHERE movie_title LIKE ? AND customer_id = ?;";
  var values = [date, movie_title, customer_id];

  db.run(statement, values, function(err) {
    if (err) {
      callback(err, { insertedID: null, changed: null });
    } else {
      callback(err, { insertedID: this.lastID, changed: this.changes });
    }

    db.close();
  });
}

module.exports = Rental;
