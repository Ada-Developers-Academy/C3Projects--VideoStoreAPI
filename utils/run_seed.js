
"use strict";

var seeder = require('./seed');

seeder(function(error, result) {
  console.log(error);
  console.log("im running the seeder");
})

