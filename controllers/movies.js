"use strict";

var Database = require('../database'); // Node module; Pulling in db object we made in a dif file

var moviesController = {
  // maybe move the var db = ... out here?
  all_movies: function(req, callback) {
    var column = req.query.order_by ? req.query.order_by : "id";
    var statement = "SELECT * FROM movies ORDER BY " + column + " ASC;";
    var db = new Database('db/development.db');

    db.query(statement, function(err, result) {
      var json_result = {
        movies: result
      };

      callback(err, json_result);
    });
  },

  movie: function(req, callback) {
    var statement = "SELECT * FROM movies WHERE id = " + req.params.id + ";";
    var db = new Database('db/development.db');

    db.query(statement, function(err, result) {
      var json_result = {
        movie: result[0]
      };

      callback(err, json_result);
    });
  }
};

module.exports = moviesController;
