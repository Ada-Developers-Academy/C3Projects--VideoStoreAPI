"use strict";

var Database = require('../database'); // Node module; Pulling in db object we made in a dif file

var customersController = {

  all_customers: function(req, callback) {
    var statement = "SELECT * FROM customers";
    var db = new Database('db/development.db');
    // pull things out of the req (like order_by, etc.)

    db.query(statement, function(err, result) {

      var json_results = {
        customers: result
      };

      callback(err, json_results);
    });

  },

  // customer: function(req, res) {
  //   var results = {
  //     id: ,
  //     name: ,
  //     registered_at: ,
  //     address: ,
  //     city: ,
  //     state: ,
  //     postal_code:,
  //     phone: ,
  //     account_credit:
  //   };

  //   return res.status(200).json(results);
  // }
};

module.exports = customersController
