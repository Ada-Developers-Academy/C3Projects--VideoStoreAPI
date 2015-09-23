"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db     = new sqlite3.Database('db/' + db_env + '.db');

var movie_fields = [
  ['title', 'text'],
  ['overview', 'text'],
  ['release_date', 'text'],
  ['inventory', 'integer'],
];

var movie_copies_fields = [
  ['is_available', 'integer']
];

var customer_fields = [
  ['name', 'text'],
  ['registered_at', 'text'],
  ['address', 'text'],
  ['city', 'text'],
  ['state', 'text'],
  ['postal_code', 'text'],
  ['phone', 'text'],
  ['account_credit', 'integer']
];

var rental_fields = [
  ['checkout_date', 'text'],
  ['return_date', 'text'],
  ['return_status', 'integer'],
  ['cost', 'integer']
];
  // sqlite does no have a separate boolean class, using values 0 and 1 for true and false

db.serialize(function() {
  // drop existing tables
  db.run("DROP TABLE IF EXISTS movies;");
  db.run("DROP TABLE IF EXISTS movie_copies;");
  db.run("DROP TABLE IF EXISTS customers;");
  db.run("DROP TABLE IF EXISTS rentals;");

  // create fresh versions of those tables
  db.run("CREATE TABLE movies (id INTEGER PRIMARY KEY);");
  db.run("CREATE TABLE customers (id INTEGER PRIMARY KEY);");

  // movie copies table with foreign keys
  db.run("CREATE TABLE movie_copies( \
    id INTEGER PRIMARY KEY, \
    movie_id INTEGER, \
    FOREIGN KEY (movie_id) REFERENCES movies(id) \
    );");

  db.run("CREATE TABLE rentals( \
    id INTEGER PRIMARY KEY, \
    movie_copy_id INTEGER, \
    customer_id INTEGER, \
    FOREIGN KEY (movie_copy_id) REFERENCES movie_copies(id), \
    FOREIGN KEY (customer_id) REFERENCES customers(id) \
    );");

  // add columns that I need to those tables
  for(var i = 0; i < movie_fields.length; i++) {
    var name = movie_fields[i][0],
        type = movie_fields[i][1];

    // ALTER TABLE movies ADD COLUMN title text;
    db.run("ALTER TABLE movies ADD COLUMN " + name + " " + type + ";");
  }

  for(var i = 0; i < movie_copies_fields.length; i++) {
    var name = movie_copies_fields[i][0],
        type = movie_copies_fields[i][1];

    // ALTER TABLE movies ADD COLUMN title text;
    db.run("ALTER TABLE movie_copies ADD COLUMN " + name + " " + type + ";");
  }

  for(var i = 0; i < customer_fields.length; i++) {
    var name = customer_fields[i][0],
        type = customer_fields[i][1];

    // ALTER TABLE customers ADD COLUMN title text;
    db.run("ALTER TABLE customers ADD COLUMN " + name + " " + type + ";");
  }

  for(var i = 0; i < rental_fields.length; i++) {
    var name = rental_fields[i][0],
        type = rental_fields[i][1];

    // ALTER TABLE customers ADD COLUMN title text;
    db.run("ALTER TABLE rentals ADD COLUMN " + name + " " + type + ";");
  }

});

db.close();
