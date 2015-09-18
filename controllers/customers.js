"use strict";

var Customer = require('../customers');

exports.customersController = {

  all: function all(req, res) {
    var customer = new Customer();
    var customers = customer.all(function(customers) {
      return res.status(200).json(customers);
    });
  }
}
