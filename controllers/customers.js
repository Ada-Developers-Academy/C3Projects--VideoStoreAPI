"use strict";
var Customer = require("../models/customer.js");

exports.customersController = {
  findAllCustomers: function(req, res) {
    var dbCustomer = new Customer();
    var result = dbCustomer.find_all(function(err,result){
    return res.status(200).json(result);
    });
  }
}
