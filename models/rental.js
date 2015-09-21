"use strict";

var sqlite3 = require('sqlite3').verbose();

function Rental() {
  this.tableName = "rentals";
}

Rental.prototype = require('./database').prototype;

Rental.prototype.checkIn = function checkIn(movie_title, date, callback) {
  var db = this.openDB();
  var statement = "UPDATE rentals SET return_date = ? WHERE movie_title LIKE ?;";
  var values = [date, movie_title];

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
