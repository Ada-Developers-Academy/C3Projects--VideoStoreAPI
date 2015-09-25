"use strict";

// ----------------- rental model ----------------- //
var RentalModel = require("../models/rental");

// --------------- helper functions --------------- //
var helps = "../helpers/";
var validateParams = require(helps + "validate_params");
var ourWebsite = require(helps + "url_base");

// -------- begin RentalsController object -------- //
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
  if (!title) { return; }

  Rental.movieInfo(title, function(error, result) {
    if (error) { result = error; }

    var msg = result.meta.message;
    if (typeof msg == "string") {
      result.meta.message = Rental.noMoviesMsg;
      result.meta.moreMovieInfo = ourWebsite + "/movies/" + title;
      result.meta.yourQuery = ourWebsite + "/rentals/" + title;
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
      result.meta.yourQuery =  ourWebsite + "/rentals/overdue/" + page;
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
      result.meta.moreMovieInfo = ourWebsite + "/movies/" + title;
      result.meta.yourQuery = ourWebsite + "/rentals/" + title + "/customers";
    }

    return response.status(result.meta.status).json(result);
  })
}

// post request, check out a title
RentalsController.checkOut = function(request, response, next) {
  var title = request.params.title;
  var id = request.params.id;

  console.log("your title is", title, "and your id is", id);

  var Rental = new RentalModel();
  Rental.checkOut(title, id, function(error, result) {
    console.log('in http response body callback, before if');
    if (error) { result = error; }
    console.log('result: ' + result);
    return response.status(200).json(result);
  })
}

RentalsController.return = function(request, response, next) {
  console.log('inside return');
  // patch request, check in a title

  var title = request.params.title;
  var id = request.params.id;

  console.log("your title is", title, "and your id is", id);

  var Rental = new RentalModel();
  Rental.return(title, id, function(error, result) {
    console.log('in http response body callback, before if');
    if (error) { result = error; }
    console.log('result: ' + result);
    return response.status(200).json(result);
  })
}

module.exports = RentalsController;
