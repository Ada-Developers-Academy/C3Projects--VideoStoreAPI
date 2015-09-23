"use strict";

// --------------- helper functions --------------- //
var helps = "../helpers/";
var fixTime = require(helps + "milliseconds_to_date");
var movies = helps + "movies/";
var validateParams = require(helps + "validate_params");
var ourWebsite = require(helps + "url_base");
// var formatMovieInfo = require(rents + "format_movie_info");
// var formatCustomerInfo = require(rents + "format_customer_info");

var Movie = function() { // movie constructor
  this.limit = 10; // we like ten
}

module.exports = Movie;
