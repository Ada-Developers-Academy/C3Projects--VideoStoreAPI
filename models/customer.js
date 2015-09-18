"use strict";

function Customer() {
  this.table_name = "customers";
}

Customer.prototype = require('../database');

module.exports = Customer;
