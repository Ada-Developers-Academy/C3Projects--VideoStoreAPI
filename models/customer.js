"use strict";

// ------------------- database ------------------- //
var sqlite3 = require("sqlite3").verbose();

// --------------- helper functions --------------- //
var helps = "../helpers/";
var fixTime = require(helps + "milliseconds_to_date");
var ourWebsite = require(helps + "url_base");
var sqlErrorHandling =  require(helps + "sql_error_handling");
var formatCustomerInfo = require(helps + "format_customer_info");

//------------------------------------------------------------------------------
//--------- begin Customer model -----------------------------------------------

var Customer = function() { // Customer constructor
  // DB connections
  var dbEnv = process.env.DB || "development";
  this.db;
  this.open = function() { this.db = new sqlite3.Database("db/" + dbEnv + ".db"); }
  this.close = function() { this.db.close(); }

  this.limit = 10; // we like ten

  // this.noMoviesMsg = "No results found. You must query this endpoint with an exact title.";
  // this.noOverdueMsg = "No results found. We either have a loose database connection or "
  //                   + "it is that magical time when NO CUSTOMERS ARE HOLDING OVERDUE FILMS!";
  // this.noCustomersMsg = "No results found. You must query this endpoint with an exact title. "
  //                     + "If you are using an exact title, no customers have a copy checked out."
}

//------------------------------------------------------------------------------
//--------- SQL statements -----------------------------------------------------

Customer.prototype.allStatement = function(page) {
  var offset = (page - 1) * this.limit;
  var customerKeys = ["id", "name", "postal_code", "registered_at"];
  var statement = "SELECT " + customerKeys.join(", ") + " FROM customers "
                + "LIMIT " + this.limit + " OFFSET " + offset + ";";
  return statement;
}

Customer.prototype.allCountStatement = function() {
  return "SELECT count(*) FROM customers";
}

Customer.prototype.allSortedStatement = function(sort, page) {
  var offset = (page - 1) * this.limit;
  var customerKeys = ["id", "name", "postal_code", "registered_at"];
  var statement = "SELECT " + customerKeys.join(", ") + " FROM customers "
                + "ORDER BY " + sort + " ASC LIMIT " + this.limit
                + " OFFSET " + offset + ";";
  return statement;
}

Customer.prototype.showStatement = function(id) {
  return "SELECT * FROM customers WHERE id=" + id + ";";
}



//------------------------------------------------------------------------------
//--------- DB interactions ----------------------------------------------------

Customer.prototype.all = function(page, callback) {
  var that = this;
  function formatData(err, res) {
    if (err) { return callback(err); }

    var results = {};
    var data = fixTime(res, "registered_at");
    results.meta = { status: 200, yourQuery: ourWebsite + "/customers/all" }
    results.data = { customers: formatCustomerInfo(data) }
    results.temp = { page: page, statement: "allCountStatement" }

    return that.addPageInfo(results, callback);
  }

  var statement = this.allStatement(page);
  this.open();
  this.db.all(statement, function(error, data) {
    return sqlErrorHandling(error, data, formatData);
  })
  this.close();
}

Customer.prototype.allSorted = function(sort, page, callback) {
  var that = this;
  function formatData(err, res) {
    if (err) { return callback(err); }

    var results = {};
    var data = fixTime(res, "registered_at");
    results.meta = { status: 200, yourQuery: ourWebsite + "/customers/all/" + sort }
    results.data = { customers: formatCustomerInfo(data) }
    results.temp = { page: page, statement: "allCountStatement" }

    return that.addPageInfo(results, callback);
  }

  var statement = this.allSortedStatement(sort, page);
  this.open();
  this.db.all(statement, function(error, data) {
    return sqlErrorHandling(error, data, formatData);
  })
  this.close();
}

Customer.prototype.addPageInfo = function(results, callback) {
  function formatData(result) {
    var totalResults = result["count(*)"];
    results.meta.totalResults = totalResults;

    if (page >= 1 && totalResults > (10 * page))
      results.meta.nextPage = results.meta.yourQuery + "/" + (page + 1);
    if (page >= 2)
      results.meta.prevPage = results.meta.yourQuery + "/" + (page - 1);
    if (page != 1)
      results.meta.yourQuery += "/" + page;

    delete results.temp;

    return results;
  }

  var page = results.temp.page;
  var statement = this[results.temp.statement]();

  this.open();
  this.db.get(statement, function(error, result) {
    if (error) { return callback(error); }
    return callback(null, formatData(result));
  });
  this.close();
}

Customer.prototype.show = function(id, callback) {
  console.log("now here inside Customer.prototype.show");
  console.log("your id is " + id);

  function formatData(err, res) {
    console.log("now here inside formatData callback");
    if (err) {
      console.log("id " + id + " is in error");
      console.log("id " + id + "'s results formatted, returning final callback you passed in");
      console.log("btw that callback is: " + callback);
      return callback(err);
    }

    var results = {};
    var data = fixTime(res, "registered_at");
    results.meta = { status: 200, yourQuery: ourWebsite + "/customers/" + id }
    results.data = { customer: data[0] }

    console.log("id " + id + "'s results formatted, returning final callback you passed in");
    console.log("btw that callback is: " + callback);
    return callback(results);
  }

  var statement = this.showStatement(id);
  this.open();
  this.db.all(statement, function(error, data) {
    console.log("now here inside database query callback");
    console.log("id: " + id + " error: " + error);
    console.log("id: " + id + " data: " + data);
    return sqlErrorHandling(error, data, formatData);
  })
  this.close();
}

module.exports = Customer;
