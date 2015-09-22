"use strict";

var fs = require('fs');
var customers = require('../customers');
var json_array = [];

  for(var i = 0; i < customers.length; i++) {
    var customer = customers[i];
    var date     = new Date(customer.registered_at);
    var formatted_date = date.toISOString();

    customer.registered_at = formatted_date.split("T")[0];
    // console.log("customer.registered_at " + customer.registered_at);

    // customer.registered_at
    json_array.push(JSON.stringify(customer));
  }
  console.log("json_array " + json_array[0]);

    // var parsed_json_array = JSON.parse(json_array);
    // console.log("parsed json_array" + JSON.parse(json_array[0]));

    fs.writeFile('formatted_customers.json', json_array, function(err) {
      if (err) {
        console.log(err);
        return;
      }
    });



  // console.log("inside writeFile ", customers[0]);
  // var json_customers =
