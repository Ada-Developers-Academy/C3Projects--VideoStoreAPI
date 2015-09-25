"use strict";

// ------------------- database ------------------- //
var sqlite3 = require("sqlite3").verbose();

// --------------- helper functions --------------- //
var helps = "../helpers/";
var rents = helps + "rentals/";
var fixTime = require(helps + "milliseconds_to_date");
var ourWebsite = require(helps + "url_base");
var sqlErrorHandling =  require(helps + "sql_error_handling");
var formatCustomerInfo = require(helps + "format_customer_info");
var formatMovieInfo = require(rents + "format_movie_info");
var addMovieMetadata = require(rents + "add_movie_to_customer_metadata");
var isMovieAvailable = require(rents + "is_movie_available");
var hoursInMilliseconds = require(rents + "convert_hours_to_milliseconds");


//------------------------------------------------------------------------------
//--------- begin Rental model -------------------------------------------------

var Rental = function() { // Rental constructor
  // DB connections
  var dbEnv = process.env.DB || "development";
  this.db;
  this.open = function() { this.db = new sqlite3.Database("db/" + dbEnv + ".db"); }
  this.close = function() { this.db.close(); }

  // rental page limit
  this.limit = 10;
  this.charge = 3.00;
  this.noMoviesMsg = "No results found. You must query this endpoint with an exact title.";
  this.noOverdueMsg = "No results found. We either have a loose database connection or "
                    + "it is that magical time when NO CUSTOMERS ARE HOLDING OVERDUE FILMS!";
  this.noCustomersMsg = "No results found. You must query this endpoint with an exact title. "
                      + "If you are using an exact title, no customers have a copy checked out."
}

//------------------------------------------------------------------------------
//--------- SQL statements -----------------------------------------------------

Rental.prototype.movieInfoStatement = function(title) {
  var movieFields = ["title", "overview", "release_date", "inventory"];
  var statement = "SELECT movies." + movieFields.join(", movies.") + ", rentals.returned "
                + "FROM rentals "
                + "LEFT JOIN movies "
                + "ON rentals.movie_title = movies.title "
                + "WHERE movies.title = '" + title + "';";
  return statement;
}

Rental.prototype.overdueStatement = function(page) {
  var offset = (page - 1) * 10;
  var customerFields = ["id", "name", "city", "state", "postal_code"];
  var statement = "SELECT customers." + customerFields.join(", customers.") + ", "
                + "rentals.check_out_date, rentals.movie_title "
                + "FROM rentals "
                + "LEFT JOIN customers "
                + "ON customers.id = rentals.customer_id "
                + "WHERE rentals.returned = 0 " // we only want customers that haven't returned a copy.
                + "AND rentals.check_out_date + " + hoursInMilliseconds(3 * 24) + " < " + Date.now() + " "
                + "LIMIT " + this.limit + " OFFSET " + offset + ";";
  return statement;
}

Rental.prototype.overdueCountStatement = function() {
  return "SELECT count(*) FROM rentals WHERE returned = 0 " // now it is easy to change the day
       + "AND check_out_date + " + hoursInMilliseconds(24 * 3) + " < " + Date.now() + ";";
}

Rental.prototype.customersStatement = function(title) {
  var customerFields = ["id", "name", "city", "state", "postal_code"];
  var statement = "SELECT customers." + customerFields.join(", customers.") + ", rentals.check_out_date "
                + "FROM rentals "
                + "LEFT JOIN customers "
                + "ON customers.id = rentals.customer_id "
                + "WHERE rentals.movie_title = '" + title + "' "
                + "AND rentals.returned = 0;"; // we only want customers that haven't returned a copy.

  return statement;
}

//------------------------------------------------------------------------------
//--------- DB interactions ----------------------------------------------------

Rental.prototype.movieInfo = function(title, callback) {
  function formatData(err, res) {
    if (err) { console.log("movieInfo fail"); return callback(err); }

    var results = {};
    var data = fixTime(res, "release_date");
    results.meta = {
      status: 200, // ok
      customersHoldingCopies: ourWebsite + "/rentals/" + title + "/customers",
      moreMovieInfo: ourWebsite + "/movies/" + title,
      yourQuery: ourWebsite + "/rentals/" + title
    }
    results.data = { movie: formatMovieInfo(data), availableToRent: isMovieAvailable(data) }

    return callback(null, results);
  }

  var statement = this.movieInfoStatement(title);

  this.open();
  this.db.all(statement, function(error, data) {
    return sqlErrorHandling(error, data, formatData);
  })
  this.close();
}

Rental.prototype.overdue = function(page, callback) {
  var that = this;
  function formatData(err, res) {
    if (err) { return callback(err); }

    var results = {};
    var data = fixTime(res, "check_out_date");
    results.meta = { status: 200, yourQuery: ourWebsite + "/rentals/overdue" }
    results.data = { customers: formatCustomerInfo(data) }
    results = addMovieMetadata(results);

    return that.addPageInfo(results, page, callback);
  }

  var statement = this.overdueStatement(page);

  this.open();
  this.db.all(statement, function(error, data) {
    return sqlErrorHandling(error, data, formatData);
  })
  this.close();
}

// overdue page helper
Rental.prototype.addPageInfo = function(results, page, callback) {
  function formatData(result) {
    var totalResults = result["count(*)"];
    results.meta.totalResults = totalResults;

    // handling for page meta data
    if (page >= 1 && totalResults > (10 * page))
      results.meta.nextPage = results.meta.yourQuery + "/" + (page + 1);
    if (page >= 2)
      results.meta.prevPage = results.meta.yourQuery + "/" + (page - 1);
    if (page != 1)
      results.meta.yourQuery += "/" + page;

    return results;
  }

  var statement = this.overdueCountStatement();

  this.open();
  this.db.get(statement, function(error, result) {
    if (error) { return callback(error); }
    return callback(null, formatData(result));
  });

  this.close();
}

Rental.prototype.customers = function(title, callback) {
  function formatData(err, res) {
    if (err) { return callback(err); }

    var results = {};
    var data = fixTime(res, "check_out_date");
    results.meta = {
      status: 200,
      moreMovieInfo: ourWebsite + "/movies/" + title,
      moreRentalInfo: ourWebsite + "/rentals/" + title,
      yourQuery: ourWebsite + "/rentals/" + title + "/customers"
    }
    results.data = { customers: formatCustomerInfo(data) }

    return callback(null, results);
  }

  var statement = this.customersStatement(title);

  this.open();
  this.db.all(statement, function(error, data) {
    return sqlErrorHandling(error, data, formatData);
  })
  this.close();
}

Rental.prototype.checkOut = function(movie_title, customer_id, callback) {
  // NOTE: maybe update to check if stock, then if stock, continue
  // 3. create a rental transaction STATEMENT
  var rentalStatement = "INSERT INTO rentals( \
    movie_title,  \
    customer_id, \
    returned, \
    check_out_date, \
    return_date) \
    VALUES (?, ?, ?, ?, ?);";

  var customerStatement = "UPDATE customers " +
    "SET account_credit = account_credit - " + this.charge +
    " WHERE id = " + customer_id;
  console.log(customerStatement)

  var values = [movie_title, customer_id, 0, Date.now(), ""];
  var that = this;

  this.open();
  this.db.serialize(function() {
    that.db.run(rentalStatement, values, function(error, data) {
      console.log("inside rentalStatement");
      // return sqlErrorHandling(error, data, formatData);
    })
    that.db.run(customerStatement, function(error, data) {
      console.log('inside customerStatement');
      // return sqlErrorHandling(error, data, formatData);
    });
  })
  this.close();

  // serialize sqlite3 queries:
  //   // find movie_id from movie table
  //   // decrement inventory -1
  //   // verify customer is a
  //   use customer_id to create new rental line
  //   query customer table to decrease account credit by CONSTANT ($3?)


  // 4. charge the customer's account STATEMENT\
  //   id INTEGER\
  //   account_credit INTEGER // somehow it is a magical 13.15 dollars and cents amt\
}

module.exports = Rental;
