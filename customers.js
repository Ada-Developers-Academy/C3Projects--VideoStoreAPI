"use-strict";
var sqlite3 = require('sqlite3').verbose();

function Customer() {
  this.table_name = "customers";
}

Customer.prototype = require('./database');

module.exports = Customer;
