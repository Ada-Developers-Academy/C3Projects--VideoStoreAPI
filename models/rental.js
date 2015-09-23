"use strict";

function Rental() { 
  this.table_name = "rentals"; 
}

Rental.prototype = require('../database_adapter');

module.exports = Rental;
