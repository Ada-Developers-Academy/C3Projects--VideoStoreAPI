"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

function Customer() {
  this.table_name = "customers";
}

Customer.prototype = require('../database');
// Customer.prototype.

module.exports = Customer;
