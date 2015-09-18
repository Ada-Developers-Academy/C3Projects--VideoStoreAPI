"use strict";

var Database = require('../database'); // Node module; Pulling in db object we made in a dif file

var customersController = {

  // maybe move the var db = ... out here?

  all_customers: function(req, callback) {
    var statement = "SELECT * FROM customers";
    var db = new Database('db/development.db');

    db.query(statement, function(err, result) {

      var json_results = {
        customers: result
      };

      callback(err, json_results);
    });

  },

  customer: function(req, callback) {
    var statement = "SELECT * FROM customers WHERE id = " + req.params.id + ";";
    var db = new Database('db/development.db');

    db.query(statement, function(err, result) {

      var json_result = {
        customer: result[0]
      };
      callback(err, json_result);
    });
  }
};

module.exports = customersController;
