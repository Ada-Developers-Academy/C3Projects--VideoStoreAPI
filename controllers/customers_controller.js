"use strict";

// ---------------- customer model ---------------- //
var CustomerModel = require("../models/customer");

// --------------- helper functions --------------- //
var helps = "../helpers/";
var validateParams = require(helps + "validate_params");
var ourWebsite = require(helps + "url_base");

// ----------- begin controller object ------------ //
var CustomersController = {};

CustomersController.all = function(request, response, next) {
  var Customer = new CustomerModel();
  var page = Number(request.params.page) || 1;

  Customer.all(page, function(error, result) {
    if (error) { result = error; }

    var msg = result.meta.message;
    if (typeof msg == "string") {
      result.meta.message = Customer.noCustomersMsg;
      result.meta.yourQuery =  ourWebsite + "/customers/all";
    }

    return response.status(result.meta.status).json(result);
  })
}

CustomersController.allSorted = function(request, response, next) {
  var Customer = new CustomerModel();
  var page = Number(request.params.page) || 1;
  var sort = request.params.sort_by;
  var validSorts = ["registered_at", "name", "postal_code"];

  if (validSorts.indexOf(sort) < 0)
    return response.status(400).json({ message: "Request malformed or sort method not recognized."});

  Customer.allSorted(sort, page, function(error, result) {
    if (error) { result = error; }

    var msg = result.meta.message;
    if (typeof msg == "string") {
      result.meta.message = Customer.noOverdueMsg;
      result.meta.yourQuery =  ourWebsite + "/customers/all/" + sort;
    }

    return response.status(result.meta.status).json(result);
  })
}

CustomersController.show = function(request, response, next) {
  var results = { meta: {}, data: {} };
  var id = request.params.id;
  results.meta.yourQuery = ourWebsite + "/customers/" + id;

  return response.status(200).json(results);
}

module.exports = CustomersController;
