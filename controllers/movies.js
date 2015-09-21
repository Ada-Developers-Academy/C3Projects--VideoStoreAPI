"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development';

exports.moviesController = {
  index: function index(req, res, callback) {
    var db = new sqlite3.Database('./db/' + db_env + '.db');
    var statement = "SELECT * from movies;";
    var results = [];
      db.all(statement, function(err, rows) {
        rows.forEach(function (row) {
          results.push(row);
        });
        db.close();
        return res.status(200).json(results);
      });
  },

  title: function title(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db');
    var results = [];
    var records = req.params.records,
        offset = req.params.offset;
    var statement = "SELECT * FROM movies ORDER BY title LIMIT ? OFFSET ? ;";
      db.all(statement, [records, offset], function(err, rows) {
        rows.forEach(function (row) {
          results.push(row);
        });
        db.close();
        return res.status(200).json(results);
      });
  },

  released: function released(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db');
    var results = [];
    var records = req.params.records,
        offset = req.params.offset;
    var statement = "SELECT * FROM movies ORDER BY release_date DESC LIMIT ? OFFSET ? ;";
      db.all(statement, [records, offset], function(err, rows) {
        rows.forEach(function (row) {
          results.push(row);
        });
        db.close();
        return res.status(200).json(results);
      });
  },

  movie_available: function movie_available(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db'),
      results = [],
      title = req.params.title,
      titleish = '%' + title + '%',
      statement = "SELECT movies.title, movies.overview, movies.inventory FROM movies, rentals WHERE movies.title=rentals.movie_title AND movies.title LIKE ? AND rentals.return_date IS NULL;";

      db.all(statement, [titleish], function(err, rows) {
        var rented = rows.length,
            movie = rows[0],
            available = movie.inventory - rented;
        results.push(movie, {'Available': available});

        db.close();
        return res.status(200).json(results);
      });
  }
}
