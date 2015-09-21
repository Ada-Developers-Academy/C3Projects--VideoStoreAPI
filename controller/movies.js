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
    var statement = "SELECT * FROM movies ORDER BY " + req.params.sort_by + " ASC "
                    + "LIMIT " + req.params.results_per_page
                    + " OFFSET " + ((req.params.page_number - 1) * req.params.results_per_page)
                    + ";";

    db.all(statement, function(err, rows) {
      res.status(200).json(rows);
    });
  },

  // '/movies/:title'
  search_title: function(req, res) {
    var statement = "SELECT * FROM movies WHERE title LIKE '%" + req.params.title + "%';";
    db.all(statement, function(err, rows) {
      res.status(200).json(rows);
    });
  }

}
