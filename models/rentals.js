"use strict";

var sqlite3 = require('sqlite3').verbose();

function Rental() {
  this.tableName = "rentals";
}

Rental.prototype = require('./database').prototype;

module.exports = Rental;
