"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');

exports.rentalsController = {
  // '/rentals/:title/current/:sort_option'
  current_rentals: function(req, res) {
    db.all("SELECT * FROM movies;", function(err, rows) {
      res.status(200).json(rows);
    });
  }
}
