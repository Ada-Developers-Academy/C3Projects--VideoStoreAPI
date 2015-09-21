"use strict";

var sqlite3 = require("sqlite3").verbose(),
    db_env = process.env.DB || 'development';

function Customer() {
  this.table_name = "customers";
}

Customer.prototype = require('../database');

// Customer.prototype.find_stuff = function(callback) {
//   var db = new sqlite3.Database('db/' + db_env + '.db');
//   var statement = "SELECT * FROM " + this.table_name + ";";
//
//   db.all(statement, function(err, res){
//     if (callback) callback(err, res);
//     db.close();
//   });
// };

// console.log(Customer.prototype);

module.exports = Customer;
