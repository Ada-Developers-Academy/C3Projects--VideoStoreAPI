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
    var number = req["query"]["n"];
    var pages = req["query"]["p"];
    var db = new Customer();
    db.find_by_sorted_date("registered_at", number, pages, function(err, result) {
      if (number && pages) {
        var select = []
        var offset = (pages - 1) * number;

        // 6 - 10 (page 2 & number 5)
        // [5, 6, 7, 8, 9]
        var selection = Array.apply(null, Array(number)).map(function (_, i) {return offset + i;});
        for (var i = selection[0]; i < (selection[0] + selection.length); i++) {
          select.push(result[i]);
        }

        // console.log(select);
        return res.status(200).json(select);
      } else {
        return res.status(200).json(result);
      }
    });
  },

  // GET /customers/by_postal_code?n=XXX&p=XXX
  showByPostalCode: function(req, res) {
    sortBy("postal_code", req, res);
  },

  // GET /customers/:id/current
  showCustomerCurrent: function(req, res) {
    var id = req["params"]["id"];
    var db = new Customer();
    db.find_current(id, function(err, result) {
      return res.status(200).json(result);
    });
  },

  // GET /customers/:id/history
  showCustomerHistory: function(req, res) {
    var id = req["params"]["id"];
    var db = new Customer();
    db.find_history(id, function(err, result) {
      return res.status(200).json(result);
    });
  }
};
