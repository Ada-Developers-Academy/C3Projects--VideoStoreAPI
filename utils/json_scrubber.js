"use strict";

var fs = require('fs');
var customers = require('../customers');
var json_array = [];

for(var i = 0; i < customers.length; i++) {
  var customer        = customers[i];
  var date            = new Date(customer.registered_at);
  var formatted_date  = date.toISOString();

  customer.registered_at = formatted_date.split("T")[0];

  json_array.push(customer);
}

var stringy_json_array = JSON.stringify(json_array);

fs.writeFile('formatted_customers.json', stringy_json_array, function(err) {
  if (err) {
    console.log(err);
    return;
  }
});
