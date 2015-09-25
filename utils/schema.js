"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

var movie_fields = [
  ['title', 'text'],
  ['overview', 'text'],
  ['release_date', 'text'],
  ['inventory', 'integer']
]

db.serialize(function() {
  // drop existing tables
  db.run("DROP TABLE IF EXISTS movies;");

  // create fresh versions of those tables
  db.run("CREATE TABLE movies (id INTEGER PRIMARY KEY);");

  // add columns that I need to those tables
  for(var i = 0; i < movie_fields.length; i++) {
    var name = movie_fields[i][0],
        type = movie_fields[i][1];

    // ALTER TABLE movies ADD COLUMN title text;
    db.run("ALTER TABLE movies ADD COLUMN " + name + " " + type + ";");
  }
});

var customer_fields = [
  ['name', 'text'],
  ['registered_at', 'text'],
  ['address', 'text'],
  ['city', 'text'],
  ['state', 'text'],
  ['postal_code', 'text'],
  ['phone', 'text'],
  ['account_credit', 'real']
]

db.serialize(function() {
  // drop existing tables
  db.run("DROP TABLE IF EXISTS customers;");

  // create fresh versions of those tables
  db.run("CREATE TABLE customers (id INTEGER PRIMARY KEY);");

  // add columns that I need to those tables
  for(var i = 0; i < customer_fields.length; i++) {
    var name = customer_fields[i][0],
        type = customer_fields[i][1];

    // ALTER TABLE movies ADD COLUMN title text;
    db.run("ALTER TABLE customers ADD COLUMN " + name + " " + type + ";");
  }
});

var rental_fields = [
  ['check_out_date', 'text'],
  ['check_in_date', 'text'],
  ['expected_return_date', 'text'],
  ['customer_id', 'integer'],
  ['movie_id', 'integer']
];

db.serialize(function() {
  // drop existing tables
  db.run("DROP TABLE IF EXISTS rentals;");

  // create fresh versions of those tables
  db.run("CREATE TABLE rentals (id INTEGER PRIMARY KEY);");

  // add columns that I need to those tables
  for(var i = 0; i < rental_fields.length; i++) {
    var name = rental_fields[i][0],
        type = rental_fields[i][1];

    // ALTER TABLE movies ADD COLUMN title text;
    db.run("ALTER TABLE rentals ADD COLUMN " + name + " " + type + ";");
  }
});

db.close();
