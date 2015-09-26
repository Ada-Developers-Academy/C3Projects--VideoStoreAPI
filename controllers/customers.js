"use strict";
var Customer = require("../models/customer.js");

exports.customersController = {
  findAllCustomers: function(req, res) {
    var dbCustomer = new Customer();
    var result = dbCustomer.find_all(function(err,result){
    return res.status(200).json(result);
    });
  },

  sortCustomersByName: function(req, res) {
    var dbCustomer = new Customer();
    var limit = req.params.limit;
    var offset = req.params.offset;
    var result = dbCustomer.sort_by("name", limit, offset, function(err,result){
    return res.status(200).json(result);
    });
  },



  sortCustomersByRegisteredAt: function(req, res) {
    var dbCustomer = new Customer();
    var limit = req.params.limit;
    var offset = req.params.offset;
    var result = dbCustomer.sort_by("registered_at", limit, offset, function(err,result){
    return res.status(200).json(result);
    });
  },

  sortCustomersByPostalCode: function(req, res) {
    var dbCustomer = new Customer();
    var limit = req.params.limit;
    var offset = req.params.offset;
    var result = dbCustomer.sort_by("postal_code", limit, offset, function(err,result){
    return res.status(200).json(result);
    });
  },

  getMoviesByCustomer: function(req, res) {
    var dbCustomer = new Customer();
    var customerId = req.params.id;
    dbCustomer.past_rentals_by_customer(customerId, function(err, result) {
      res.status(200).json(result);
    });
  },

  getCurrentMoviesbyCustomer: function(req, res) {
    var dbCustomer = new Customer();
    var customerId = req.params.id;
    dbCustomer.current_checkout_rentals('customer_id', customerId, function(err, result) {
      res.status(200).json(result);
    });
  }


}
