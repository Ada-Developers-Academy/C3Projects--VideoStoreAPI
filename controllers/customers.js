"use strict";

var Database = require('../database');

exports.customersController = {

  customers: function(req, res) {
    var customers = Database.query("SELECT * FROM customers");

    // loop
    var results = {
      customers: []
    };

    return res.status(200).json(results);
  },

  customer: function(req, res) {
    var results = {
      id: ,
      name: ,
      registered_at: ,
      address: ,
      city: ,
      state: ,
      postal_code:,
      phone: ,
      account_credit:
    };

    return res.status(200).json(results);
  }

  // database_test: function(req, res) {
  //   var db = new Database();
  //   db.test();
  //
  //   return res.status(200).send("plain text message");
  // },

  // zomg: function zomg(req, res) {
  //   var results = {
  //     zomg: "zomg it worked!",
  //     moar: "zomg moar"
  //   };
  //
  //   return res.status(200).json(results);
  // },
  //
  // another_endpoint: function another_endpoint(req, res) {
  //   return res.status(200).json({ why: "I don't know." });
  // }
};
