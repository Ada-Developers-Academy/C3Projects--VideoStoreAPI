"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

var movie_fields = [
  ['title', 'text'],
  ['overview', 'text'],
  ['release_date', 'text'],
  ['inventory_total', 'integer'],
  ['inventory_avail', 'integer']
];

var customer_fields = [
  ['name', 'text'],
  ['registered_at', 'text'],
  ['address', 'text'],
  ['city', 'text'],
  ['state', 'text'],
  ['postal_code', 'text'],
  ['phone', 'text'],
  ['account_credit', 'text']
];

var rental_fields = [
  ['customer_id', 'integer'],
  ['movie_id', 'integer'],
  ['checkout_date', 'text'],
  ['due_date', 'text'],
  ['return_date', 'text']
];

db.serialize(function() {
  // drop existing tables
  db.run("DROP TABLE IF EXISTS movies;");
  db.run("DROP TABLE IF EXISTS customers;");
  db.run("DROP TABLE IF EXISTS rentals;");

  // create fresh versions of tables
  db.run("CREATE TABLE movies (id INTEGER PRIMARY KEY);");
  db.run("CREATE TABLE customers (id INTEGER PRIMARY KEY);");
  db.run("CREATE TABLE rentals (id INTEGER PRIMARY KEY);");


  // add columns to movies tables
  for(var i = 0; i < movie_fields.length; i++) {
    var name = movie_fields[i][0],
        type = movie_fields[i][1];

    db.run("ALTER TABLE movies ADD COLUMN " + name + " " + type + ";");
  }

  // add columns to customers table
  for(var i = 0; i < customer_fields.length; i++) {
    var name = customer_fields[i][0],
        type = customer_fields[i][1];

    db.run("ALTER TABLE customers ADD COLUMN " + name + " " + type + ";");
  }

  // add columns to rentals table
  for(var i = 0; i < rental_fields.length; i++) {
    var name = rental_fields[i][0],
        type = rental_fields[i][1];

    db.run("ALTER TABLE rentals ADD COLUMN " + name + " " + type + ";");
  }

});

db.close();
