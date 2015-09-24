"use strict";

// ----------------- movie model ----------------- //
var movieTable = require('../models/movie');

// ------------------- database ------------------- //
var sqlite3 = require("sqlite3").verbose();
var dbEnv = process.env.DB || "development";

// --------------- helper functions --------------- //
var helps = "../helpers/";
var fixTime = require(helps + "milliseconds_to_date");
var ourWebsite = require(helps + "url_base");

var MoviesController = {};

//--------- GET /all -----------------------------------------------------------
MoviesController.all = function(request, response) {
  var movies = new movieTable();

  // prepare statement
  var page = request.params.page || 1;
  movies.all(page, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET /all, sort by title --------------------------------------------
MoviesController.all_by_title =  function(request, response) {
  var movies = new movieTable();
  var page = request.params.page || 1;

  movies.all_by_title(page, function(error, result) {
    if (error) { result  = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET /all, sort by release_date -------------------------------------
MoviesController.all_by_release_date = function(request, response) {
  var movies = new movieTable();
  var page = request.params.page || 1

  movies.all_by_release_date(page, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET /:title, aka Movie#show ----------------------------------------
MoviesController.title = function(request, response) {
  var movies = new movieTable();
  var queried_title = request.params.title;

  movies.title(queried_title, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET rentals of :title, sorted by customer_id -----------------------
MoviesController.rentals_by_customer_id =  function(request, response) {
  var movies = new movieTable();
  var title = request.params.title;

  movies.rentals_by_customer_id(title, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET rentals of :title, sorted by customer_name ---------------------
MoviesController.rentals_by_customer_name = function(request, response) {
  var movies = new movieTable();
  var title = request.params.title;

  movies.rentals_by_customer_name(title, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
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
