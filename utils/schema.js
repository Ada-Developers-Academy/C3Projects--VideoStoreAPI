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
  ['registered_at', 'integer'],
  ['address', 'text'],
  ['city', 'text'],
  ['state', 'text'],
  ['postal_code', 'text'],
  ['phone', 'text'],
  ['account_credit', 'float']
]

var rental_fields = [
  ['check_out', 'integer'],
  ['check_in', 'integer'],
  ['due_date', 'integer'],
  ['overdue', 'integer', 'DEFAULT 0'], // 0 for false 1 for true
  ['movie_title', 'string'],
  ['customer_id', 'integer']
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
          // FOREIGN KEY (customer_id) REFERENCES customer(id), \
          // FOREIGN KEY (movie_id) REFERENCES movie(id));");


  // 3. add the columns to those tables
  // CREATE MOVIES TABLE COLUMNS
  for(var i = 0; i < movie_fields.length; i++) {
    var movie_name = movie_fields[i][0],
        movie_type = movie_fields[i][1];

    db.run("ALTER TABLE movies ADD COLUMN " + movie_name + " " + movie_type + ";");
  }

  // CREATE CUSTOMERS TABLE COLUMNS
  for(var l = 0; l < customer_fields.length; l++) {
    var customer_name = customer_fields[l][0],
        customer_type = customer_fields[l][1];

    db.run("ALTER TABLE customers ADD COLUMN " + customer_name + " " + customer_type + ";");
  }

  // CREATE RENTALS TABLE COLUMNS
  for(var k = 0; k < rental_fields.length; k++) {
    var rental_name = rental_fields[k][0],
        rental_type = rental_fields[k][1];
        default_value = (rental_fields[k][2] === undefined) ? "" : rental_fields[k][2];


    db.run("ALTER TABLE rentals ADD COLUMN " +
            rental_name + " " + rental_type + " " + default_value + ";");
  }
});

db.close();
