"use strict";

// var sqlite3 = require('sqlite3').verbose(); // currently unused

function Customer() {
  this.tableName = 'customers';
  this.columnNames = [
    'name', // TEXT NOT NULL
    'registered_at', // TEXT
    'address', // TEXT
    'city', // TEXT
    'state', // TEXT
    'postal_code', // TEXT
    'phone TEXT', // TEXT
    'account_balance' // INTEGER NOT NULL DEFAULT 0
  ];
}

Customer.prototype = require('./database').prototype;

module.exports = Customer;
