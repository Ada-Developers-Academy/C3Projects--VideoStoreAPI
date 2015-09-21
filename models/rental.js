"use strict";

var sqlite3 = require('sqlite3').verbose();

function Rental() {
  this.tableName = "rentals";
  this.columnNames = [
    'checkout_date', // TEXT NOT NULL DEFAULT CURRENT_DATE
    'return_date', // TEXT
    'movie_title', // TEXT NOT NULL // FOREIGN KEY(movie_title) REFERENCES movies(title)
    'customer_id' // INTEGER NOT NULL // FOREIGN KEY(customer_id) REFERENCES customers(id)
  ];
}

Rental.prototype = require('./database').prototype;

Rental.prototype.checkIn = function checkIn(movie_title, date, callback) {
    var db = this.openDB();
    var statement = "UPDATE rentals SET return_date = ? WHERE movie_title LIKE ?;";
    var values = [date, movie_title];

    db.run(statement, values, function(err) {
      // TODO / FIXME: if there's an error, `this` doesn't exist #changes
      callback(err, { changed: this.changes });
      db.close();
    });
  }

module.exports = Rental;
