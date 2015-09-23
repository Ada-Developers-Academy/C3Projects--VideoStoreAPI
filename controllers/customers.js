"use strict";
var shared = require('./shared_functions');
// var all_call = new all_call,
    // db = new db;
//
// var sqlite3 = require('sqlite3').verbose(),
//   db_env = process.env.DB || 'development';
// var db = new sqlite3.Database('./db/' + db_env + '.db');
// var results = [];
// function all_call(db, results, statement, res) {db.all(statement, function(err, rows) {
//     rows.forEach(function (row) {
//       results.push(row);
//     });
//     db.close();
//     return res.status(200).json(results);
//   });
// }

exports.customersController = {

  index: function index(req, res, callback) {
    var statement = "SELECT * from customers;";
    // all_call(db, results, statement, res);
        db.all(statement, function(err, rows) {
          rows.forEach(function (row) {
            results.push(row);
          });
          db.close();
          return res.status(200).json(results);
        });
      // all customers
  },
  name: function name(req,res) {
    // var db = new sqlite3.Database('./db/' + db_env + '.db');
    // var customer_names = [];
    var records = req.params.records,
        offset = req.params.offset;
    var statement = "SELECT * FROM customers ORDER BY name ASC LIMIT ? OFFSET ?;";
        db.all(statement, [records, offset], function(err, rows) {
          rows.forEach(function (row) {
            customer_names.push(row);
          });
          db.close();
          return res.status(200).json(customer_names);
        });
      // sorted by name somehow
  },
  registered: function registered(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db');
    var customer_regist = [];
    var records = req.params.records,
        offset = req.params.offset;
    var statement = "SELECT * FROM customers ORDER BY registered_at ASC LIMIT ? OFFSET ?;";
        db.all(statement, [records, offset], function(err, rows) {
          rows.forEach(function (row) {
            customer_regist.push(row);
          });
          db.close();
          return res.status(200).json(customer_regist);
        });
      // sorted by registered date somehow
  },
  postal: function postal(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db');
    var customer_postal = [];
    var records = req.params.records,
        offset = req.params.offset;
    var statement = "SELECT * FROM customers ORDER BY postal_code ASC LIMIT ? OFFSET ?;";
        db.all(statement, [records, offset], function(err, rows) {
          rows.forEach(function (row) {
            customer_postal.push(row);
          });
          db.close();
          return res.status(200).json(customer_postal);
        });
      // sorted by postal code somehow
  },
  current: function current(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db');
    var customer_rentals = [];
    var id = req.params.id;
    var statement = "SELECT * FROM rentals WHERE customer_id=? AND return_date IS NULL;";
        db.all(statement, [id], function(err, rows) {
          rows.forEach(function (row) {
            customer_rentals.push(row);
          });
          db.close();
          return res.status(200).json(customer_rentals);
        });
    // all checked out movies for a given customer id
  },

  history: function history(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db');
    var customer_rentals = [];
    var id = req.params.id;
    var statement = "SELECT movie_title, checkout_date, return_date FROM rentals WHERE customer_id=? AND return_date IS NOT NULL ORDER BY checkout_date;";
        db.all(statement, [id], function(err, rows) {
          rows.forEach(function (row) {
            customer_rentals.push(row);
          });
          db.close();
          return res.status(200).json(customer_rentals);
        });
      // all previously checked out movies for a given customer id
  }
}
