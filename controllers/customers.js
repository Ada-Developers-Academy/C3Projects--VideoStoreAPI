"use strict";

var Customer = require('../models/customers');

function sortBy(sort_by, req, res) {
  var number = req["query"]["n"];
  var pages = req["query"]["p"];
  var db = new Customer();
  db.find_by_sorted(sort_by, number, pages, function(err, result) {
    return res.status(200).json(result);
  });
}

exports.customersController = {
  // GET /customers
  index: function(req, res) {
    // var results = { "customers": [] }
    var db = new Customer();
    db.all(function(err, result) {
      console.log(result)
      results = []
      for (var i = 0; i < result.length; i++) {
        result[i].name
        results.push()
      }

    // id: 1,
    // name: 'Shelley Rocha',
    // registered_at: 'Wed, 29 Apr 2015 07:54:14 -0700',
    // address: 'Ap #292-5216 Ipsum Rd.',
    // city: 'Hillsboro',
    // state: 'OR',
    // postal_code: '24309',
    // phone: '(322) 510-8695',
    // account_credit: 13.15 },
      return res.status(200).json(result);
    });
  },

  // GET /customers/:id
  show: function(req, res) {
    // returns currently checkout_out movies & rental history
    var id = req["params"]["id"];
    var db = new Customer();
    db.find_checked_out(id, function(err, result) {
      return res.status(200).json(result);
    });
  },

  // GET /customers/by_name?n=XXX&p=XXX
  showByName: function(req, res) {
    sortBy("name", req, res);
  },

  // GET /customers/by_registered_at?n=XXX&p=XXX
  // NOTE: Need to change registered at to a time object? Sorting alphabetally vs. by date!
  showByRegistered_at: function(req, res) {
    sortBy("registered_at", req, res);
  },

  // GET /customers/by_postal_code?n=XXX&p=XXX
  showByPostalCode: function(req, res) {
    sortBy("postal_code", req, res);
  }
};
