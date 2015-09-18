"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');

exports.moviesController = {
  all_movies: function(req, res) {
    db.all("SELECT * FROM movies;", function(err, rows) {
      res.status(200).json(rows);
    });
  }
}
