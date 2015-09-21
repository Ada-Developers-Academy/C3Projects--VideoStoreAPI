"use strict";

var fs = require('fs');
var customers = require('../customers');

fs.writeFile('formatted_customers.json', customers, function(err) {
  if(err) {
    console.log("error");
    return;
  }

  for(var i = 0; i < customers.length; i++) {
    var customer = customers[i];
    var date     = new Date(customer.registered_at);
    var formatted_date = date.toISOString();
    customer.registered_at = formatted_date.split("T")[0];
    // customer.registered_at
    JSON.stringify(customer);
  }
  // var json_customers =
})
