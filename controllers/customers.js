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
    var customer_renting_statment = 
      "SELECT * FROM rentals \
      WHERE customer_id = " + req.params.id + "AND \
      return_date IS NULL;";

    var customer_rented_statment =
      "SELECT * FROM rentals \
      WHERE customer_id = " + req.params.id + "AND \
      return_date IS NOT NULL;";

    var db = new Database('db/development.db');

    var customer_info = db.query(statement, function(err, result) {
      return result[0];
    });

    var customer_renting = db.query(customer_renting_statment, function(err, result) {
      return result;
    })

    var customer_rented = db.query(customer_rented_statment, function(err, result) {
      return result;
    })

    console.log(customer_info);

    var json_result = {
      customer: customer_info,
      renting: customer_renting,
      rented: customer_rented 
    };

    callback(err, json_result);
  }
};

module.exports = customersController;
