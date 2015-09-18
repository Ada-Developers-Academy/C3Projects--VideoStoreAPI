"use strict";

var Database = require('../database'); // Node module; Pulling in db object we made in a dif file

var customersController = { 

  all_customers: function(req, callback) {
    var statement = "SELECT * FROM customers";

    // pull things out of the req (like order_by, etc.)

    var customers = Database.query(statement, function(res) {  
      // prepare json object
      
      // loop
      var results = {
        customers: []
      }

      callback(customers);
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

