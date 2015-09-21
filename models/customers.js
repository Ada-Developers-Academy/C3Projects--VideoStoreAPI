"use strict";

var sqlite3 = require("sqlite3").verbose(),
    db_env = process.env.DB || 'development';

function Customer() {
  this.table_name = "customers";
}

Customer.prototype = require('../database');

Customer.prototype.find_checked_out = function(id, callback) {
  var db = new sqlite3.Database('db/' + db_env + '.db');
  var currently_checked_out_movies_statement =
    "SELECT * FROM rentals WHERE customer_id = " + id +
    " AND check_in_date IS NULL;";
  var returned_movies_statement =
    "SELECT * FROM rentals WHERE customer_id = " + id +
    " AND check_in_date IS NOT NULL;";

  db.all(currently_checked_out_movies_statement, function(err, res1) {
    db.all(returned_movies_statement, function(err, res2) {
      var result = {
        "checked_out_movies": res1,
        "returned_movies": res2
      };
      if (callback) callback(err, result);

      db.close();
    });
  });
};

Customer.prototype.find_by_sorted = function(sort_by, number, pages, callback) {
  var db = new sqlite3.Database('db/' + db_env + '.db');
  var statement;
  if (number && pages) {
    var offset = (pages - 1) * number;
    statement = "SELECT * FROM customers ORDER BY " + sort_by + " ASC LIMIT " + number + " OFFSET " + offset + ";";
  }
  else {
    statement = "SELECT * FROM customers ORDER BY " + sort_by + " ASC;";
  }

  db.all(statement, function(err, res) {
    if (callback) callback(err, res);
    db.close();
  });
};

Customer.prototype.find_by_sorted_date = function(sort_by, number, pages, callback) {
  var db = new sqlite3.Database('db/' + db_env + '.db');
  var statement = "SELECT * FROM customers;";

  db.all(statement, function(err, res) {
    // console.log(res);
    // [ { id: 1,
    //     name: 'Shelley Rocha',
    //     registered_at: 'Wed, 29 Apr 2015 07:54:14 -0700',
    //     address: 'Ap #292-5216 Ipsum Rd.',
    //     city: 'Hillsboro',
    //     state: 'OR',
    //     postal_code: '24309',
    //     phone: '(322) 510-8695',
    //     account_credit: 13.15 },
    //   { id: 2,

    // for each registered_at key inside the object inside the array
    // compare

    var sorted = res.sort(function(a, b){
      return new Date(a.registered_at) - new Date(b.registered_at)
    });
    console.log(sorted);




    // if (number && pages) {
    //   var offset = (pages - 1) * number;
    //
    //
      // var list = [{"name": "Bob", "me": 75}, {"name": "Anna", "me": 25}, {"name": "Jill", "me": 50}];
      // keysSorted = list.sort(function(a, b){return a.me-b.me});
      // alert(keysSorted);
      // keysSorted = Object.keys(list).sort(function(a,b){return list[a]-list[b]})
      // alert(keysSorted);
    // }
    // else {
    //   statement = "SELECT * FROM customers ORDER BY " + sort_by + " ASC;";
    // }

    if (callback) callback(err, res);
    db.close();
  });
};

module.exports = Customer;
