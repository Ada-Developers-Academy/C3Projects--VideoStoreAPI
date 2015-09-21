"use strict";

var Customer = function() { // Customer constructor
  this.limit = 10; // we like ten
}




// all w/ sort by field
// - SELECT * FROM customers ORDER BY (columnName);

// all w/ pagination /customers/all&pagination=1
// - first page: SELECT * FROM customers ORDER BY (columnName) LIMIT pageLimit;
// - second page: SELECT * FROM customers ORDER BY (columnName) LIMIT pageLimit OFFSET offsetAmount;

module.exports = Customer;
