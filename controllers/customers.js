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

    var offset = (pageNumber - 1) * 50;

    customer.find_subset(column, 50, offset, function(err, record) {
      res.status(200).json({ customer_subset: record });
    })
  },

  current_rentals: function current_rentals(req, res, customer_id) {

    var customer = new Customer();

    customer.customer_rentals(customer_id, function(err, record){
      res.status(200).json({ current_rentals: record });
    })
  },

  rental_history: function rental_history(req, res, customer_id) {

    var customer = new Customer();

    customer.customer_history(customer_id, function(err, record){
      res.status(200).json({ rental_history: record });
    })
  }
}
