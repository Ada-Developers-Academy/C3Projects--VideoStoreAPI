"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db     = new sqlite3.Database('db/' + db_env + '.db');

exports.moviesController = {
  movies: function(req, res) {
    db.all("SELECT * FROM movies", function(err, all_movies) {
      return res.status(200).json(all_movies);
    });
  },

  movies_by_title: function(req, res) {
    var title = req.params.title;
    console.log(title);
    db.get("SELECT * FROM movies WHERE title='" + title + "';", function(err, the_title) {
      console.log(typeof title);
      return res.status(200).json(the_title);

    });
  }



}; // end exports.moviesController
