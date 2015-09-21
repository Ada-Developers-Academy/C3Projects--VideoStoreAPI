"use strict";

function Rental() {
  this.table_name = "rentals";
}

Rental.prototype = require('../database');

module.exports = Rental
