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

    var db = new Database('db/development.db');

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

    var db = new Database('db/development.db');

    db.query(statement, function(err, result) {

      var json_result = {
        movie: result
      };

      callback(err, json_result);
    });
  },

  movie_rentals: function(req, callback) {
    var column = req.query.order_by ? req.query.order_by : "customer_id";
    var title = req.params.title   
    var statement = 
      "SELECT \
        rentals.id, rentals.title, rentals.customer_id, rentals.name, \
        rentals.checkout_date, rentals.due_date, rentals.return_date \
      FROM movies, rentals \
      WHERE rentals.movie_id = movies.id AND movies.title LIKE '%" + title + "%' \
      ORDER BY " + column + " ASC;";

    var db = new Database('db/development.db');

    db.query(statement, function(err, result) {

      var current_rentals_array = [];
      var previous_rentals_array = [];

      for(var i = 0; i < result.length; i++) {
        
        var rental = { 
          rental_id: result[i].id,
          movie_title: result[i].title,
          customer_id: result[i].customer_id,
          customer_name: result[i].name,
          checkout_date: result[i].checkout_date,
          due_date: result[i].due_date,
          return_date: result[i].return_date
        };

        if(rental.return_date == null) {
          current_rentals_array.push(rental);
        } else {
          previous_rentals_array.push(rental);
        };
      };

      var json_result = {
        current_rentals: current_rentals_array,
        previous_rentals: previous_rentals_array
      };

      callback(err, json_result);
    });
  }
};

module.exports = moviesController;
