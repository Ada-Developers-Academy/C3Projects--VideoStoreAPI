"use strict";

// var sqlite3 = require('sqlite3').verbose();
// var db = require('../db/development.db');
// var db = new sqlite3.Database('../db/development.db');

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development';

exports.customersController = {

  index: function index(req, res, callback) {
    var db = new sqlite3.Database('./db/' + db_env + '.db');
    var statement = "SELECT * from customers;";
    var all_customers = []
        db.all(statement, function(err, rows) {
          rows.forEach(function (row) {
            all_customers.push(row);
          });
          db.close();
          return res.status(200).json(all_customers);
        });
      // all customers
  },
name: function name(req,res) {
  var results = {
    // sorted by name somehow
  }
return res.status(200).json(results);
},
registered: function registered(req,res) {
  var results = {
    // sorted by registered date somehow
  }
return res.status(200).json(results);
},
postal: function postal(req,res) {
  var results = {
    // sorted by postal code somehow
  }
return res.status(200).json(results);
},
current: function current(req,res) {
  var results = {
    // all checked out movies for a given customer id
  }
return res.status(200).json(results);
},
history: function history(req,res) {
  var results = {
    // all previously checked out movies for a given customer id
  }
return res.status(200).json(results);
},
}
