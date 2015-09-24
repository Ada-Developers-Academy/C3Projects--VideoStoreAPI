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
    if (error) { result = error; }

    var msg = result.meta.message;
    if (typeof msg == "string") {
      result.meta.message = Rental.noMoviesMsg;
    }

    return response.status(result.meta.status).json(result);
  })
}

RentalsController.overdue = function(request, response, next) {
  var Rental = new RentalModel();
  var page = request.params.page || 1;

  Rental.overdue(page, function(error, result) {
    if (error) { result = error; }

    var msg = result.meta.message;
    if (typeof msg == "string") {
      result.meta.message = Rental.noOverdueMsg;
    }

    return response.status(result.meta.status).json(result);
  })
}

RentalsController.customers = function(request, response, next) {
  var Rental = new RentalModel();

  // basic handling for attempted sql injection
  var callbackFxn = RentalsController.fixParamsOrReturnError(response);
  var title = validateParams(request, "title", callbackFxn);
  if (!title) { console.log("attempted SQL injection"); return; }

  Rental.customers(title, function(error, result) {
    if (error) { result = error; }

    var msg = result.meta.message;
    if (typeof msg == "string") {
      result.meta.message = Rental.noCustomersMsg;
    }

    return response.status(result.meta.status).json(result);
  })
}

RentalsController.checkOut = function(request, response, next) {
  // post request, check out a title
}

RentalsController.return = function(request, response, next) {
  // patch request, check in a title
}

module.exports = RentalsController;
