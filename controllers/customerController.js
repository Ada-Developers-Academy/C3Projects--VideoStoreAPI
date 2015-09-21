"use strict";
var customerTable = require('../models/customer');
var sqlite3 = require("sqlite3").verbose();
var dbEnv = process.env.DB || "development";

module.exports = {
  potato: function (req, res) {
    return res.status(200).send("potato potato potato");
  },
  
  all: function(request, response) {
    var db = new sqlite3.Database("db/" + dbEnv + ".db");
    var customers = new customerTable();

    // prepare statement
    var pageNumber = 3;
    var offset = (pageNumber - 1) * customers.limit;
    var statement = "SELECT * FROM customers LIMIT " + customers.limit +
      " OFFSET " + offset + ";";

    var db = new sqlite3.Database("db/" + dbEnv + ".db");

    db.all(statement, function(err, results) { // closure
      if(err) {
        console.log(err); // error handling
        return;
      }
      return response.status(200).json(results);
    });

    db.close();
  }
}
