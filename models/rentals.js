"use strict";

var sqlite3 = require('sqlite3').verbose();

function Rental() {
  this.tableName = "rentals";
}

Rental.prototype = require('./database').prototype;

Rental.prototype.return = function update(movie_title, date, callback) {
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
