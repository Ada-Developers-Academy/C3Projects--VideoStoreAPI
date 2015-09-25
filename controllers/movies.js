"use strict";

var Database = require('../database'); // Node module; Pulling in db object we made in a dif file

var moviesController = {
  // maybe move the var db = ... out here?
  all_movies: function(req, callback) {
    var column = req.query.order_by ? req.query.order_by : "id";
    
    if (req.query.number && req.query.page) {
      var limit = req.query.number;
      var offset = req.query.page * limit - limit;
      var statement = "SELECT * FROM movies ORDER BY " + column + " ASC LIMIT " + limit + " OFFSET " + offset + ";";
    } else {
      var statement = "SELECT * FROM movies ORDER BY " + column + " ASC;";
    }

    var db_env = process.env.DB || 'development',
        db = new Database('db/' + db_env + '.db');

    db.query(statement, function(err, result) {
      var json_result = {
        movies: result
      };

      callback(err, json_result);
    });
  },

  movie: function(req, callback) {
    var column = req.query.order_by ? req.query.order_by : "title";
    var title = req.params.title   
    var statement = "SELECT * FROM movies WHERE title LIKE '%" + title + "%' ORDER BY " + column + " ASC;";

    var db_env = process.env.DB || 'development',
        db = new Database('db/' + db_env + '.db');

    db.query(statement, function(err, result) {

      var json_result = {
        movie: result
      };

      callback(err, json_result);
    });
  },
};

module.exports = moviesController;
