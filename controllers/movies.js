"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');

exports.moviesController = {

  // GET /movies
  getAllMovies: function(res) {
    db.all("SELECT title, overview, release_date, inventory FROM movies", function(err, rows) {
      if (err != null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // GET /movies/id/:id
  getMovieById: function(id, res) {
    db.all("SELECT title, overview, release_date, inventory FROM movies WHERE id=?", id, function(err, rows) {
      if (err != null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // GET /movies/title/:title
  getMovieByTitle: function(title, res) {
    db.all("SELECT title, overview, release_date, inventory FROM movies WHERE title LIKE ?", title, function(err, rows) {
      if (err != null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  }

  /*

  Get /movies/:id(synopsis, inventory, release_date)

  GET /movies/:title/inventory

  GET /movies/title?n=XXX&p=XXX

  GET /movies/release_date?n=XXX&p=XXX

  GET /movies/:title/checked_out_current

  GET /movies/:title/checked_out_history?ordered_by=XXX
    // ordered_by
      // - id
      // - name
      // - check out date
  */
}
