"use-strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

var movie_fields = [
  ['title', 'text'],
  ['overview', 'text'],
  ['release_date', 'text'],
  ['inventory', 'integer'],
  ['inventory_available', 'integer']
]

var customer_fields = [
  ['name', 'text'],
  ['registered_at', 'text'],
  ['address', 'text'],
  ['city', 'text'],
  ['state', 'text'],
  ['postal_code', 'text'],
  ['phone', 'text'],
  ['account_credit', 'float']
]

var rental_fields = [
  ['check_out', 'text'],
  ['check_in', 'text'],
  ['due_date', 'text'],
  ['overdue', 'integer'], // 0 for false 1 for true
  ['customer_id', 'integer'],
  ['movie_id', 'integer']
]

// I want these to work somewhat how rake db:reset works, so I need to do three things:
// db.serialize will make sure that these things happen in order (otherwise
// they would execute asynchronously)
db.serialize(function() {
  // 1. drop existing tables  (run means, do this right now!)
  db.run("DROP TABLE IF EXISTS movies;");
  db.run("DROP TABLE IF EXISTS customers;");
  db.run("DROP TABLE IF EXISTS rentals;");

  // 2. create fresh versions of those tables
  db.run("CREATE TABLE movies (id INTEGER PRIMARY KEY);");
  db.run("CREATE TABLE customers (id INTEGER PRIMARY KEY);");
  db.run("CREATE TABLE rentals (id INTEGER PRIMARY KEY);");

  // 3. add the columns to those tables
  // CREATE MOVIES TABLE COLUMNS
  for(var i = 0; i < movie_fields.length; i++) {
    var name = movie_fields[i][0],
        type = movie_fields[i][1];

    db.run("ALTER TABLE movies ADD COLUMN " + name + " " + type + ";");
  }

  // CREATE CUSTOMERS TABLE COLUMNS
  for(var i = 0; i < customer_fields.length; i++) {
    var name = customer_fields[i][0],
        type = customer_fields[i][1];

    db.run("ALTER TABLE customers ADD COLUMN " + name + " " + type + ";");
  }

  // CREATE RENTALS TABLE COLUMNS
  for(var i = 0; i < rental_fields.length; i++) {
    var name = rental_fields[i][0],
        type = rental_fields[i][1];

    db.run("ALTER TABLE rentals ADD COLUMN " + name + " " + type + ";");
  }
});

db.close();
