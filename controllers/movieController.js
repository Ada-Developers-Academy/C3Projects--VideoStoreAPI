"use strict";

// ----------------- movie model ----------------- //
var movieTable = require('../models/movie');

// ------------------- database ------------------- //
var sqlite3 = require("sqlite3").verbose();
var dbEnv = process.env.DB || "development";

// --------------- helper functions --------------- //
var helps = "../helpers/";
var fixTime = require(helps + "milliseconds_to_date");
// var rents = helps + "movies/";
// var validateParams = require(helps + "validate_params");
var ourWebsite = require(helps + "url_base");
// var formatMovieInfo = require(rents + "format_movie_info");
// var formatCustomerInfo = require(rents + "format_customer_info");


var MoviesController = {};

//--------- GET /all -----------------------------------------------------------
MoviesController.all = function(request, response) {
  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var movies = new movieTable();

  // prepare statement
  var page = request.params.page || 1;
  var offset = (page - 1) * movies.limit;
  var statement = "SELECT * FROM movies LIMIT " + movies.limit +
    " OFFSET " + offset;

  db.all(statement, function(err, results) { // closure
    if(err) {
      console.log(err); // error handling
      return;
    }
    results = fixTime(results, 'release_date');
    return response.status(200).json(results);
  });

  db.close();
}

//--------- GET /all, sort by title --------------------------------------------
MoviesController.all_by_title =  function(request, response) {
  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var movies = new movieTable();
  var page = request.params.page || 1;
  var offset = (page - 1) * movies.limit;
  var statement = "SELECT * FROM movies ORDER BY (title) LIMIT "
    + movies.limit + " OFFSET " + offset;

  db.all(statement, function(err, results) { // closure
    if(err) {
      console.log(err); // error handling
      return;
    }
    results = fixTime(results, 'release_date');
    return response.status(200).json(results);
  });

  db.close();
}

//--------- GET /all, sort by release_date -------------------------------------
MoviesController.all_by_release_date = function(request, response) {
  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var movies = new movieTable();

  // prepare statement
  var page = request.params.page || 1
  var offset = (page - 1) * movies.limit;
  var statement =
    "SELECT * FROM movies \
    ORDER BY (release_date) \
    LIMIT " + movies.limit + " \
    OFFSET " + offset + ";";

  db.all(statement, function(err, results) { // closure
    if(err) {
      console.log(err); // error handling
      return;
    }
    results = fixTime(results, 'release_date');
    return response.status(200).json(results);
  });

  db.close();
}

//--------- GET /:title, aka Movie#show ----------------------------------------
MoviesController.title = function(request, response) {
  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var movies = new movieTable();
  var queried_title = request.params.title;

  var statement =
    "SELECT * FROM movies \
    WHERE title = '" + queried_title + "'";

  db.all(statement, function(err, result) {
    if(err) {
      console.log(err); // error handling
      return;
    };
    result = fixTime(result, 'release_date');
    return response.status(200).json(result);
  });

  db.close();
}

//--------- GET rentals of :title, sorted by customer_id -----------------------
MoviesController.rentals_by_customer_id =  function(request, response) {
  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var movies = new movieTable();
  var title = request.params.title;
  var query = request.params.query;
  var page = request.params.page || 1;
  var offset = (page - 1) * movies.limit;

    var statement =
      "SELECT customers.name, rentals.check_out_date, \
      rentals.movie_title \
      FROM rentals LEFT JOIN customers \
      ON rentals.customer_id = customers.id \
      WHERE rentals.movie_title = '" + title + "' \
      AND rentals.returned = 1 \
      ORDER BY customers.id";

  db.all(statement, function(err, results) {
    if(err) {
      console.log(err); // error handling
      return;
    };
    results = fixTime(results, 'check_out_date');
    return response.status(200).json(results);

  });

  db.close();
}

//--------- GET rentals of :title, sorted by customer_name ---------------------
MoviesController.rentals_by_customer_name = function(request, response) {
  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var movies = new movieTable();
  var title = request.params.title;
  var query = request.params.query;
  var page = request.params.page || 1;
  var offset = (page - 1) * movies.limit;

  var statement =
    "SELECT customers.name, rentals.check_out_date, \
    rentals.movie_title \
    FROM rentals LEFT JOIN customers \
    ON rentals.customer_id = customers.id \
    WHERE rentals.movie_title = '" + title + "' \
    AND rentals.returned = 1 \
    ORDER BY customers.name";

  db.all(statement, function(err, result) {
    if(err) {
      console.log(err); // error handling
      return;
    };
    result = fixTime(result, 'check_out_date');
    return response.status(200).json(result);
  });

  db.close();
}

//--------- GET rentals of :title, sorted by check_out_date --------------------
MoviesController.rentals_by_check_out_date = function(request, response) {
  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var movies = new movieTable();
  var title = request.params.title;
  var query = request.params.query;
  var page = request.params.page || 1;
  var offset = (page - 1) * movies.limit;

  var statement =
    "SELECT customers.name, rentals.check_out_date, \
    rentals.movie_title \
    FROM rentals LEFT JOIN customers \
    ON rentals.customer_id = customers.id \
    WHERE rentals.movie_title = '" + title + "' \
    AND rentals.returned = 1 \
    ORDER BY check_out_date";

  db.all(statement, function(err, result) {
    if(err) {
      console.log(err); // error handling
      return;
    };
    result = fixTime(result, 'check_out_date');
    return response.status(200).json(result);

  });

  db.close();
}

//--------- GET a list of customers who have rented :title ---------------------
MoviesController.whos_renting = function(request, response) {
  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var movies = new movieTable();
  var title = request.params.title;
  var page = request.params.page || 1;
  var offset = (page - 1) * movies.limit;

  var statement =
    "SELECT customers.name, rentals.check_out_date, \
    rentals.movie_title \
    FROM rentals LEFT JOIN customers \
    ON rentals.customer_id = customers.id \
    WHERE rentals.movie_title = '" + title + "' \
    AND rentals.returned = 0 \
    LIMIT " + movies.limit + " \
    OFFSET " + offset;

  db.all(statement, function(err, result) {
    if(err) {
      console.log(err); // error handling
      return;
    };
    result = fixTime(result, 'check_out_date');
    return response.status(200).json(result);

  });

  db.close();
}

module.exports = MoviesController;
