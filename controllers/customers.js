"use strict";

var Customer = require('../models/customer');

exports.customersController = {
  index: function index(req, res) {
    var customers = new Customer();
    var results = customers.find_all();
    console.log(customers);
    return res.status(200).json(results);
    }
  }
}
