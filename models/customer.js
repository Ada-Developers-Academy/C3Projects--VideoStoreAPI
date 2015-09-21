"use strict";

function Customer() {
  this.table_name = "customers";
}

Customer.prototype = require('../database');
var customer = new Customer();
// customer.find_by("title", "Jaws", function(err, res){});
customer.find_all(function(err, res){});
// customer.sort_by("title", function(err, res){});
module.exports = Customer;
