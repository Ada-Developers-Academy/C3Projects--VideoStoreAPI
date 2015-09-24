"use strict";

// ----------------- rental model ----------------- //
var RentalModel = require('../models/rental');

// --------------- helper functions --------------- //
var helps = "../helpers/";
var rents = helps + "rentals/";
var fixTime = require(helps + "milliseconds_to_date");
var validateParams = require(helps + "validate_params");
var ourWebsite = require(helps + "url_base");
var formatCustomerInfo = require(helps + "format_customer_info");
var formatMovieInfo = require(rents + "format_movie_info");
var addMovieMetadata = require(rents + "add_movie_to_customer_metadata");
var isMovieAvailable = require(rents + "is_movie_available");
var hoursInMilliseconds = require(rents + "convert_hours_to_milliseconds");

// ------------ begin RentalsController object ------------ //
var RentalsController = {};


RentalsController.fixParamsOrReturnError = function(response) {
  // this is where @jnf was using function sharing
  // Controller.send_json.bind(response);
  return function(error, validParams) {
    if (error) {
      response.status(error.status).json(error);
      return false;
    } else {
      return validParams;
    }
  }
}

RentalsController.movieInfo = function(request, response, next) {
  var Rental = new RentalModel();

  // basic handling for attempted sql injection
  var callbackFxn = RentalsController.fixParamsOrReturnError(response);
  var title = validateParams(request, "title", callbackFxn);
  if (!title) { console.log("attempted SQL injection"); return; }

  Rental.movieInfo(title, function(error, result) {
    if (error)
      return response.status(error.meta.status).json(error);
    else
      return response.status(result.meta.status).json(result);
  })
}

RentalsController.overdue = function(request, response, next) {
  // var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var page = Number(request.params.page) || 1;
  var offset = (page - 1) * 10;
  var status = 200; // ok

  var customerFields = ["id", "name", "city", "state", "postal_code"];
  var statement = "SELECT customers." + customerFields.join(", customers.") + ", "
                + "rentals.check_out_date, rentals.movie_title "
                + "FROM rentals "
                + "LEFT JOIN customers "
                + "ON customers.id = rentals.customer_id "
                + "WHERE rentals.returned = 0 " // we only want customers that haven't returned a copy.
                + "AND rentals.check_out_date + " + hoursInMilliseconds(72) + " < " + Date.now() + " "
                + "LIMIT " + Rental.limit + " OFFSET " + offset + ";";

  // query database
  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  db.all(statement, function(error, data) {
    var results = { meta: {} };

    if (error) { // log error if error
      status = 500; // internal server error
      results.data = error;
    } else if (data.length == 0) { // handling for no results
      status = 303; // see other
      results.data = {
        status: status,
        message: "No results found. You must query this endpoint with an exact title. "
               + "If you are using an exact title, no customers have a copy checked out."
      };
    } else {
      data = fixTime(data, "check_out_date"); // fixing time
      results.data = { customers: formatCustomerInfo(data) };
      results = addMovieMetadata(results);
    };

    results.meta.yourQuery = ourWebsite + "/rentals/overdue";

    // page meta data handling
    // we only want customers that haven't returned a copy
    // and we only want records that are past due
    var countStatement = "SELECT count(*) FROM rentals WHERE returned = 0 " // now it is easy to change the day
                       + "AND check_out_date + " + hoursInMilliseconds(24 * 3) + " < " + Date.now() + ";";
    db.get(countStatement, function(countError, countData) {
      // handling for total results meta data
      var totalResults = countData["count(*)"];
      results.meta.totalResults = totalResults;

      // handling for page meta data
      if (page >= 1 && totalResults > (10 * page))
        results.meta.nextPage = results.meta.yourQuery + "/" + (page + 1);
      if (page >= 2)
        results.meta.prevPage = results.meta.yourQuery + "/" + (page - 1);
      if (page != 1)
        results.meta.yourQuery += "/" + page;

      return response.status(status).json(results);
    })
  })

  db.close();
}

RentalsController.customers = function(request, response, next) {
  var callbackFxn = RentalsController.fixParamsOrReturnError(response);
  var title = validateParams(request, "title", callbackFxn);
  if (!title) { console.log("attempted SQL injection"); return; }

  var status = 200; // ok
  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var customerFields = ["id", "name", "city", "state", "postal_code"];

  var statement = "SELECT customers." + customerFields.join(", customers.") + ", rentals.check_out_date "
                + "FROM rentals "
                + "LEFT JOIN customers "
                + "ON customers.id = rentals.customer_id "
                + "WHERE rentals.movie_title = '" + title + "' "
                + "AND rentals.returned = 0;"; // we only want customers that haven't returned a copy.

  // query database
  var db = new sqlite3.Database("db/" + dbEnv + ".db"); // grab the database
  db.all(statement, function(error, data) { // query the database
    var results = { meta: {} };

    if (error) { // log error if error
      status = 500; // internal server error
      results.data = error;
    } else if (data.length == 0) { // handling for no results
      status = 303; // see other
      results.data = {
        status: status,
        message: "No results found. You must query this endpoint with an exact title. "
               + "If you are using an exact title, no customers have a copy checked out."
      };
    } else {
      data = fixTime(data, "check_out_date"); // fixing time
      results.data = { customers: formatCustomerInfo(data) };
      results.meta.moreRentalInfo = ourWebsite + "/rentals/" + title;
    };

    results.meta.movieInfo = ourWebsite + "/movies/" + title;
    results.meta.yourQuery = ourWebsite + "/rentals/" + title + "/customers";

    return response.status(status).json(results);
  })

  db.close();
}

RentalsController.checkOut = function(request, response, next) {
  // post request, check out a title
}

RentalsController.return = function(request, response, next) {
  // patch request, check in a title
}

module.exports = RentalsController;
