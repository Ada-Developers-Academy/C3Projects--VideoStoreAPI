"use strict";

// --------------- helper functions --------------- //
var helps = "../helpers/";
var rents = helps + "rentals/";
var fixTime = require(helps + "milliseconds_to_date");
var validateParams = require(helps + "validate_params");
var ourWebsite = require(helps + "url_base");
var formatMovieInfo = require(rents + "format_movie_info");
var formatCustomerInfo = require(rents + "format_customer_info");
var addMovieMetadata = require(rents + "add_movie_to_customer_metadata");
var isMovieAvailable = require(rents + "is_movie_available");
var hoursInMilliseconds = require(rents + "convert_hours_to_milliseconds");

var Rental = function() { // Rental constructor
  this.foo = "bar";
}

// Rental.prototype.formatMovieInfo 

Rental.prototype.movieInfo = function(error, data) {
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
      movieInfo: formatMovieInfo(data),
      availableToRent: isMovieAvailable(data)
    };

    var title = results.data.movieInfo.title;
    results.meta.customersHoldingCopies = ourWebsite + "/rentals/" + title + "/customers";
  };

  results.meta.movieInfo = ourWebsite + "/movies/" + title;
  results.meta.yourQuery = ourWebsite + "/rentals/" + title;

  return results;
}







module.exports = Rental;
