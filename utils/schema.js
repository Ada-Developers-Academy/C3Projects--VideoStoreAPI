"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');

var movie_fields = [
  ['title', 'text'],
  ['overview', 'text'],
  ['release_date', 'text'],
  ['inventory', 'integer']
];

db.serialize(function() {
  db.run("DROP TABLE IF EXISTS movies;");
  db.run("CREATE TABLE movies (id INTEGER PRIMARY KEY);");

  for(var i = 0; i < movie_fields.length; i++) {
    var name = movie_fields[i][0];
    var type = movie_fields[i][1];

    db.run("ALTER TABLE movies ADD COLUMN " + name + " " + type + ";");
  }
});


var customer_fields = [
  ['name', 'text'],
  ['registered_at', 'text'],
  ['address', 'text'],
  ['city', 'text'],
  ['state', 'text'],
  ['postal_zip', 'integer'],
  ['phone_number', 'text'],
  ['credit', 'real']
];

db.serialize(function() {
  db.run("DROP TABLE IF EXISTS customers;");
  db.run("CREATE TABLE customers (id INTEGER PRIMARY KEY);");

  for(var i = 0; i < customer_fields.length; i++) {
    var name = customer_fields[i][0];
    var type = customer_fields[i][1];

    db.run("ALTER TABLE customers ADD COLUMN " + name + " " + type + ";");
  }
});


var rental_fields = [
  ['customer_id', 'integer'],
  ['movie_id', 'integer'],
  ['return_date', 'text'],
  ['checkout_date', 'text'],
  ['due_date', 'text']
];

db.serialize(function() {
  db.run("DROP TABLE IF EXISTS rentals;");
  db.run("CREATE TABLE rentals (id INTEGER PRIMARY KEY);");

  for(var i = 0; i < rental_fields.length; i++) {
    var name = rental_fields[i][0];
    var type = rental_fields[i][1];

    db.run("ALTER TABLE rentals ADD COLUMN " + name + " " + type + ";");
  }
});

db.close();
