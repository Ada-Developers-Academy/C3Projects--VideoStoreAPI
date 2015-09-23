"use strict";

// ------------------- database ------------------- //
var sqlite3 = require("sqlite3").verbose();
var dbEnv = process.env.DB || "development";

// --------------- helper functions --------------- //
var helps = "../helpers/";
var custs = helps + "customers/";
var fixTime = require(helps + "milliseconds_to_date");
var validateParams = require(helps + "validate_params");
var ourWebsite = require(helps + "url_base");
var formatCustomerInfo = require(helps + "format_customer_info");


// ------------ begin controller object ------------ //
var CustomersController = {};

CustomersController.all = function(request, response, next) {
  var results = { meta: {}, data: {} };
  results.meta.yourQuery = ourWebsite + "/customers" + "/all";

  return response.status(200).json(results);
}

CustomersController.allSorted = function(request, response, next) {
  var results = { meta: {}, data: {} };
  var sort = request.params.sort_by;
  var validSorts = ["registered_at", "name", "postal_code"];

  if (validSorts.indexOf(sort) < 0)
    return response.status(400).json({ message: "request malformed or sort method not recognized"});

  results.meta.yourQuery = ourWebsite + "/customers" + "/all/" + sort;

  // handling for pagination
  var page = Number(request.params.page) || 1;
  var offset = (page - 1) * 10;

  var db = new sqlite3.Database("db/" + dbEnv + ".db");
  var customerKeys = ["id", "name", "postal_code", "registered_at"];
  var statement = "SELECT " + customerKeys.join(", ") + " FROM customers "
                + "ORDER BY " + sort + " ASC LIMIT 10 OFFSET " + offset + ";";
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
