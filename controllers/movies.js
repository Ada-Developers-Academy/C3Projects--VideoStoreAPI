"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db     = new sqlite3.Database('db/' + db_env + '.db');

exports.moviesController = {
  movies: function(req, res) {
    db.all("SELECT * FROM movies", function(err, all_movies) {
      return res.status(200).json(all_movies);
    });
  }
};
