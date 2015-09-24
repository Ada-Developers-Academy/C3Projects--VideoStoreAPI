"use strict";

// --------------- helper functions --------------- //
var helps = "../helpers/";
var fixTime = require(helps + "milliseconds_to_date");
var movies = helps + "movies/";
var validateParams = require(helps + "validate_params");
var ourWebsite = require(helps + "url_base");
var sqlErrorHandling = require(helps + 'sql_error_handling');

var sqlite3 = require("sqlite3").verbose();

var Movie = function() { // movie constructor
  this.limit = 10; // we like ten
  var dbEnv = process.env.DB || 'development';
  this.db;
  this.open = function() { this.db = new sqlite3.Database("db/" + dbEnv + ".db")}
  this.close = function() { this.db.close(); }
}

Movie.prototype.movieInfo = function(error, data) {

  var results = { meta: {} };
  var status;
  if (error) { // log error if error
    status = 500; // internal server error
    results.data = {
      status: status,
      message: error
    }
  } else if (data.length == 0) { // handling for no results
    status = 303; // see other
    results.data = {
      status: status,
      message: "No results found. You must query this endpoint with an exact title."
    };
  } else {
    data = fixTime(data, "release_date"); // fixing time
    status = 200; // ok
    results.data = {
      status: status,
      movieInfo: data[0]
    };

    var title = results.data.movieInfo.title;
    results.meta.customersHoldingCopies = ourWebsite + "/rentals/" + title + "/customers";
  };

  results.meta.rentalInfo = ourWebsite + "/rentals/" + title;
  results.meta.yourQuery = ourWebsite + "/movies/" + title;

  return results;

}

Movie.prototype.all  = function(page, callback) {

  function formatData(err, res) {
    if (err) {return callback(err);}

    var data = fixTime(res, 'release_date');

    var results = {};

    results.meta = {
      status: 200,
      yourQuery: ourWebsite + '/movies/all'
    }

    results.data = {
      movies: data
    }

    return callback(null, results);
  }

  var offset = (page - 1) * this.limit;
  var statement = "SELECT * FROM movies LIMIT " + this.limit +
    " OFFSET " + offset;

  this.open();
  this.db.all(statement, function(error, data) {
    return sqlErrorHandling(error, data, formatData);
  })
  this.close();
}

Movie.prototype.all_by_title  = function(page, callback) {

  function formatData(err, res) {
    if (err) {return callback(err);}

    var data = fixTime(res, 'release_date');

    var results = {};

    results.meta = {
      status: 200,
      yourQuery: ourWebsite + '/movies/all/sort_by=title'
    }

    results.data = {
      movies: data
    }

    return callback(null, results);
  }

  var offset = (page - 1) * this.limit;
  var statement = "SELECT * FROM movies ORDER BY (title) LIMIT "
    + this.limit + " OFFSET " + offset;

  this.open();
  this.db.all(statement, function(error, data) {
    return sqlErrorHandling(error, data, formatData);
  })
  this.close();
}

module.exports = Movie;
