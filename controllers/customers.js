"use strict";

var Customer = require('../models/customer');

exports.customersController = {
  index: function index(req, res) {

    var customer = new Customer();

    customer.find_all(function(err, record) {
      res.status(200).json({ all_customers: record });
    })
  },

  subset: function subset(req, res, column, pageNumber) {

    var customer = new Customer();

    var offset = pageNumber * 50;

    customer.find_subset(column, 50, offset, function(err, record) {
      res.status(200).json({ customer_subset: record });
    })
  }
}
