"use strict";

var Movie = require('../models/movies'),
    sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development';

var Controller = {
  index: function(req, res, next) {
    new Movie().all(Controller.send_json.bind(res))
  },

  title: function(req, res, next) {
    new Movie().some('title', req.params.records, req.params.offset,
                     Controller.send_json.bind(res));
  },

  released: function(req, res, next) {
    new Movie().some('release_date DESC', req.params.records, req.params.offset,
                     Controller.send_json.bind(res));
  },

  movie_available: function(req, res, next) {
    var db = new sqlite3.Database('./db/' + db_env + '.db'),
      results = [],
      title = req.params.title,
      titleish = '%' + title + '%',
       // need to account for movies that may not have rentals and movies with titleish matches
      statement = "SELECT movies.title, movies.overview, movies.inventory FROM movies, rentals WHERE movies.title LIKE ? AND movies.title=rentals.movie_title AND rentals.return_date IS NULL;",
      all_statement = "SELECT movies.title, movies.overview, movies.inventory FROM movies WHERE movies.title LIKE ?;";

      db.serialize(function() {
        db.all(statement, [titleish], function(err, rows) {
          var rented = rows.length,
              movie = rows[0];
            if (movie == undefined) {
              db.all(all_statement, [titleish], function(err, rows) {
                var movie = rows[0],
                    available = movie.inventory;
              results.push(movie, {'Available': available});
              db.close();
              return res.status(200).json(results);
              });
            } else {
              var available = movie.inventory - rented;
              results.push(movie, {'Available': available});
              db.close();
              return res.status(200).json(results);
            }
        });
      });
   },

  send_json: function(error, res) {
    if (error) {
      this.status(500).json(error);
    } else {
      this.status(200).json(res);
    }
  }
}

module.exports = Controller
