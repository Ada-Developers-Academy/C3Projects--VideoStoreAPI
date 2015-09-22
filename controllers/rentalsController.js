"use strict";

// ----------------- rental model ----------------- //
var rentalTable = require('../models/rental');

// ------------------- database ------------------- //
var sqlite3 = require("sqlite3").verbose();
var dbEnv = process.env.DB || "development";
var noDb = "no database table connected yet";

// --------------- helper functions --------------- //
var fixTime = require("../helpers/millisecondsToDate");
var validateParams = require("../helpers/validateParams");
var ourWebsite = require("../helpers/urlBase");
var formatMovieInfo = require("../helpers/rentals/formatMovieInfo");
var isMovieAvailable = require("../helpers/rentals/isMovieAvailable");

// ------------ begin controller object ------------ //
var rentals = {};


rentals.fixParamsOrReturnError = function(resp) {
  return function(err, validParams) {
    if (err) {
      resp.status(err.status).json(err);
      return false;
    } else {
      return validParams;
    }
  }
}


rentals.movieInfo = function(req, resp) {
  // basic handling for attempted sql injection
  var title = validateParams(req, "title", this.fixParamsOrReturnError(resp));
  if (!title) { console.log("attempted SQL injection"); return; }

  var status = 200; // ok

  var movieFields = ["title", "overview", "release_date", "inventory"];

  // SELECT movies.title, movies.overview, movies.release_date, movies.inventory, rentals.returned
  // FROM rentals LEFT JOIN movies ON rentals.movie_title = movies.title WHERE movies.title = 'Alien';
  var statement = "SELECT movies." + movieFields.join(", movies.") + ", rentals.returned "
                + "FROM rentals "
                + "LEFT JOIN movies "
                + "ON rentals.movie_title = movies.title "
                + "WHERE movies.title = '" + title + "';";

  // query database
  var db = new sqlite3.Database("db/" + dbEnv + ".db"); // grab the database
  db.all(statement, function(err, data) { // query the database
    var results = {};

    if (err) { // log error if error
      status = 500; // internal server error
      results.data = err;
    } else if (data.length == 0) { // handling for no results
      status = 303; // see other
      results.data = {
        status: status,
        message: "No results found. You must query this endpoint with an exact title."
      };
    } else {
      data = fixTime(data, "release_date"); // fixing time
      results.data = {
        movieInfo: formatMovieInfo(data),
        availableToRent: isMovieAvailable(data)
      };
    };

    results.meta = {
      searchMovies: ourWebsite + "/movies/" + title,
      yourQuery: ourWebsite + "/rentals/" + title
    };

    return resp.status(status).json(results);
  });

  db.close();
}

rentals.movieInfos = function(req, resp) {

}

rentals.overdue = function(req, resp) {
  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var page = req.params.page;

  var statement = "";
  var result = { overdueTitles: noDb, currentPage: page };
  return resp.status(200).json(result);
}

rentals.customers = function(req, resp) {
  var db = new sqlite3.Database("db/" + dbEnv + ".db");

  var statement = "";

  var result = { customers: noDb };
  return resp.status(200).json(result);
}

module.exports = rentals;
