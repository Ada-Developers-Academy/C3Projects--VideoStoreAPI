"use strict";

var Customer = require('../customers');

exports.customersController = {

  all: function all(req, res) {
    var customer = new Customer();
    var customers = customer.all(function(customers) {
      return res.status(200).json(customers);
    });
  },

  registered_at_sort: function registered_at_sort(req, res) {
    var customer = new Customer();
    var sort_type = "registered_at";
    var records_per_page = req.params.records_per_page;
    var offset = req.params.offset;
    var customers = customer.sort_by(sort_type, records_per_page, offset, function(customers) {
      return res.status(200).json(customers);
    });
  },

name_sort: function name_sort(req, res) {
  var customer = new Customer();
  var sort_type = "name";
  var records_per_page = req.params.records_per_page;
  var offset = req.params.offset;
  var customers = customer.sort_by(sort_type, records_per_page, offset, function(customers) {
    return res.status(200).json(customers);
  });
}
}
