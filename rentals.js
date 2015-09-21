"use-strict";
var sqlite3 = require('sqlite3').verbose();

function Rental() {
  this.table_name = "rentals";
}

Rental.prototype = require('./database');

module.exports = Rental;
