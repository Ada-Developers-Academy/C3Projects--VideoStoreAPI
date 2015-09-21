"use strict";

// var sqlite3 = require('sqlite3').verbose(); // currently unused

function Customer() {
  this.tableName = 'customers';
}

Customer.prototype = require('./database').prototype;

module.exports = Customer;
