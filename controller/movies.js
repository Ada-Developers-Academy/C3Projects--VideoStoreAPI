"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');

exports.moviesController = {
  // '/movies'
  all_movies: function(req, res) {
    db.all("SELECT * FROM movies;", function(err, rows) {
      res.status(200).json(rows);
    });
  },

  // '/movies/:sort_by/:results_per_page/:page_number'
  sort_pages: function(req, res) {
    if (req.params.sort_by == "title") {
      db.all("SELECT * FROM movies ORDER BY title ASC;", function(err, rows) {
        res.status(200).json(rows);
      });
    }

    if (req.params.sort_by == "release_date") {
      console.log(req.params.sort_by);
      db.all("SELECT * FROM movies ORDER BY release_date ASC;", function(err, rows) {
        res.status(200).json(rows);
      });
    }

  }
}
