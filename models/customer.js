"use strict";

var sqlite3 = require("sqlite3").verbose();
var dbEnv = process.env.DB || "development";

var Customer = function() { // Customer constructor
  this.limit = 10; // we like ten
}

Customer.prototype.all = function(pageNumber) { // customer.all(pageNo); // pageNo = 3
  var results;

  // prepare statement
  var offset = (pageNumber - 1) * this.limit;
  var statement = "SELECT * FROM customers LIMIT " + this.limit + " OFFSET " + offset + ";";

  // do something with the statement
  // somehow db.run(statement, null, function(etc...) triggers the following error:
  // - Error: SQLITE_RANGE: bind or column index out of range
  // removing that gives us:
  // - null
  var db = new sqlite3.Database("db/" + dbEnv + ".db");

  db.all(statement, function(err, res) { // closure
    if(err) {
      console.log(err); // error handling
      return;
    }
    results = res;
    console.log('results are: ' + results);
    return results;
  });

  db.close();


}

// all w/ sort by field
// - SELECT * FROM customers ORDER BY (columnName);

// all w/ pagination /customers/all&pagination=1
// - first page: SELECT * FROM customers ORDER BY (columnName) LIMIT pageLimit;
// - second page: SELECT * FROM customers ORDER BY (columnName) LIMIT pageLimit OFFSET offsetAmount;

module.exports = Customer;
