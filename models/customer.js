"use strict";

function Customer() {
  this.table_name = "customers";
}

Customer.prototype = require('../database');
var customer = new Customer();
customer.find_all(function(err, res){});
module.exports = Customer;
