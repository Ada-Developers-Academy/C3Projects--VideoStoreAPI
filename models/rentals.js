"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development';

  function Rental() {
   this.table_name = "rentals";
  }

  Rental.prototype = require("./database");

  Rental.prototype.checkInMovie = function checkInMovie(title, id, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db'),
        statement = "Update rentals SET return_date = date('now'), overdue = (CASE WHEN (date('now') > due_date) THEN 1 ELSE 0 END) WHERE return_date IS NULL AND movie_title = ? AND customer_id = ?;";

    db.all(statement, [title, id], function(err) {
      if (err) {
        callback(err, { message: "Check-in failed" });
        db.close();
      } else {
        console.log(statement, title, id);
        callback(err, { message: 'Check-in successful', movie_title: title, customer_id: id });
        db.close();
      }
    });
  }

module.exports = Rental
