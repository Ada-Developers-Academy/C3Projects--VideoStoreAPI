"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env  = process.env.DB || 'development',
    db;


exports.moviesController = {
  movies: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    db.all("SELECT * FROM movies", function(err, all_movies) {
      db.close();
      return res.status(200).json(all_movies);
    });

  },

  movies_by_title: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var title = req.params.title.toLowerCase();
    db.get("SELECT * FROM movies WHERE title LIKE ?;", title, function(err, the_title) {
      db.close();
      return res.status(200).json(the_title);
    });

  }





}; // end exports.moviesController
