"use strict";

var Customer = require('../customers');
var customer = new Customer();

var sortInfo = function(sort_type, params, res) {
  var records_per_page = params.records_per_page;
  var offset = params.offset;
  var customers = customer.sort_by(sort_type, records_per_page, offset, function(customers) {
    return res.status(200).json(customers);
  });
}

exports.customersController = {

  all: function all(req, res) {
    var customers = customer.all(function(customers) {
      return res.status(200).json(customers);
    });
  },

  registered_at_sort: function registered_at_sort(req, res) {
    var sort_type = "registered_at";
    sortInfo(sort_type, req.params, res);
  },

  name_sort: function name_sort(req, res) {
    var sort_type = "name";
    sortInfo(sort_type, req.params, res);
  },

  postal_code_sort: function postal_code_sort(req, res) {
    var sort_type = "postal_code";
    sortInfo(sort_type, req.params, res);
  }
}
