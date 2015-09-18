"use strict";

var Customer = require('../models/customer');

exports.customersController = {
  index: function index(req, res) {

    var customer = new Customer();

    customer.find_all(function(err, record) {
      res.status(200).json({ all_customers: record });
    })
  },

  subset: function subset(req, res, column) {

    var customer = new Customer();

    customer.find_subset(column, 5, 0, function(err, record) {
      res.status(200).json({ subset_customers: record });
    })
  }
}
