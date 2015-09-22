"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

function Movie() {
  this.table_name = "movies";
}

Movie.prototype = require('../database');

// Movie.prototype - extend to validation functions (e.g., is_a_movie)

Movie.prototype.movie_info = function(title, callback) {
  var db = new sqlite3.Database('db/' + db_env + '.db');
  // information about specified movie
  var statement = "SELECT 'movies'.* FROM movies where movies.title = ? COLLATE NOCASE LIMIT 1; ";

  db.all(statement, title, function(err, rows) {
    callback(err, rows);
    db.close();
  });
}

module.exports = Movie;
