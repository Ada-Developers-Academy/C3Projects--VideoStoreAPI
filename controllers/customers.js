"use strict";

var Database = require('../database'); // Node module; Pulling in db object we made in a dif file

var customersController = {

  // maybe move the var db = ... out here?

  // "/customers?order_by=name"
  all_customers: function(req, callback) {
    var column = req.query.order_by ? req.query.order_by : "id";
    var statement = "SELECT * FROM customers ORDER BY " + column + " ASC;";
    var db = new Database('db/development.db');

    db.query(statement, function(err, result) {

      var json_results = {
        customers: result
      };

      callback(err, json_results);
    });

  },

  customer: function(req, callback) {
    var json_result = {};

    var statement = "SELECT * FROM customers WHERE id = " + req.params.id + ";";
    var customer_renting_statement = 
      "SELECT * FROM rentals WHERE customer_id = " + req.params.id + " AND return_date IS NULL;";

    var customer_rented_statement =
      "SELECT * FROM rentals \
      WHERE customer_id = " + req.params.id + " AND \
      return_date IS NOT NULL;";

    var db = new Database('db/development.db');

    function firstQuery(err, this_query, callback) { 
      db.query(this_query, function(err, result) {
        json_result.customer = result[0];
      });

      callback(err, customer_renting_statement, thirdQuery);
    };

      function secondQuery(err, this_query, callback) {
        db.query(this_query, function(err, result) {
          json_result.renting = result;
        });

        callback(err, customer_rented_statement);
      };

        function thirdQuery(err, this_query) {
          db.query(customer_rented_statement, function(err, result) {
            json_result.rented = result;
            console.log(json_result);
          });
        };


    firstQuery(err, statement, secondQuery);
    

    // var customer_info = db.query(statement, function(err, result) {
    //   json_result.customer = result[0];
    // });

    // var customer_renting = db.query(customer_renting_statement, function(err, result) {
    //   json_result.renting = result;
    // })

    // var customer_rented = db.query(customer_rented_statement, function(err, result) {
    //   json_result.rented = result;
    // })

    // console.log("customer_info = " + customer_info);
    // console.log("customer_renting = " + customer_renting);
    // console.log("customer_rented = " + customer_rented);

    // var json_result = {
    //   customer: customer_info,
    //   renting: customer_renting,
    //   rented: customer_rented 
    // };

    callback(err, json_result);
  }
};

module.exports = customersController;
