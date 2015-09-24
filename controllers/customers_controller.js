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
  var results = { meta: {}, data: {} };
  results.meta.yourQuery = ourWebsite + "/customers" + "/all";

  return response.status(200).json(results);
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

  return;


  var results = { meta: {}, data: {} };

  results.meta.yourQuery = ourWebsite + "/customers" + "/all/" + sort;

  // handling for pagination
  var page = Number(request.params.page) || 1;
  var offset = (page - 1) * 10;

  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  db.all(statement, function(error, result) {
    // converting time back into human readable format
    result = fixTime(result, "registered_at");

    // adding query's result to results object
    results.data.customers = formatCustomerInfo(result);

    var countStatement = "SELECT count(*) FROM customers;";
    db.get(countStatement, function(countError, countResult) {
      // handling total results
      var totalResults = countResult["count(*)"];
      results.meta.totalResults = totalResults;

      // handling for page meta data
      if (page >= 1 && totalResults > 10 * page)
        results.meta.nextPage = results.meta.yourQuery + "/" + (page + 1);
      if (page >= 2)
        results.meta.prevPage = results.meta.yourQuery + "/" + (page - 1);
      if (page != 1)
        results.meta.yourQuery += "/" + page;

      return response.status(200).json(results);
    })
  })

  // db.close();
}

CustomersController.show = function(request, response, next) {
  var results = { meta: {}, data: {} };
  var id = request.params.id;
  results.meta.yourQuery = ourWebsite + "/customers" + "/" + id;

  return response.status(200).json(results);
}

module.exports = CustomersController;
