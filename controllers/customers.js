"use strict";

var customer_instance = require('../models/customers');
var Customer = new customer_instance;

function sortBy(the_function, sort_by, req, res) {
  var number = req["query"]["n"];
  var pages = req["query"]["p"];
  the_function(sort_by, number, pages, function(err, result) {
    return res.status(200).json(result);
  });
}

function showRentals(the_function, req, res) {
  var id = req["params"]["id"];
  the_function(id, function(err, result) {
    return res.status(200).json(result);
  });
}

exports.customersController = {
  // GET /customers
  index: function(req, res) {
    Customer.all(function(err, result) {
      return res.status(200).json(result);
    });
  },

  // GET /customers/by_name?n=XXX&p=XXX
  showByName: function(req, res) {
    sortBy(Customer.find_by_sorted, "name", req, res);
  },

  // GET /customers/by_registered_at?n=XXX&p=XXX
  showByRegisteredAt: function(req, res) {
    sortBy(Customer.find_by_sorted_date, "registered_at", req, res)
  },

  // GET /customers/by_postal_code?n=XXX&p=XXX
  showByPostalCode: function(req, res) {
    sortBy(Customer.find_by_sorted, "postal_code", req, res);
  },

  // GET /customers/:id/current
  showCustomerCurrent: function(req, res) {
    showRentals(Customer.find_current, req, res);
  },

  // GET /customers/:id/history
  showCustomerHistory: function(req, res) {
    showRentals(Customer.find_history, req, res);
  }
};
