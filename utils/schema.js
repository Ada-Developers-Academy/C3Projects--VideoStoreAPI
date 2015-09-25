"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db = new sqlite3.Database('db/' + db_env + '.db'); // creates db connection

var movie_table = "movies";

var customer_table = "customers";
var customer_fields = [
  ['name', 'text'],
  ['registered_at', 'text'],
  ['address', 'text'],
  ['city', 'text'],
  ['state', 'text'],
  ['postal_code', 'text'],
  ['phone', 'text'],
  ['account_credit', 'float'],
];

var rental_table = "rentals";

function create_table(table_name, table_fields)  {
  db.serialize(function() {
    // drop existing tables
    db.run("DROP TABLE IF EXISTS " + table_name + ";");

    // create fresh version of table with id as primary key
    db.run("CREATE TABLE " + table_name +
    " (id INTEGER PRIMARY KEY);");

    // add columns to those tables
    for(var i = 0; i < table_fields.length; i++) {
      var name = table_fields[i][0],
          type = table_fields[i][1];

      db.run("ALTER TABLE " + table_name +
      " ADD COLUMN " + name + " " + type +
      ";");
    }
  });
}

function create_movies_table(table_name)  {
  db.serialize(function() {
    // drop existing tables
    db.run("DROP TABLE IF EXISTS " + table_name + ";");

    // create fresh version of table with id as primary key
    db.run("CREATE TABLE " + table_name +
    " (id INTEGER PRIMARY KEY, \
      title TEXT, \
      overview TEXT, \
      release_date TEXT, \
      inventory INTEGER NOT NULL CHECK(inventory > 0), \
      num_available INTEGER NOT NULL CHECK(num_available <= inventory \
        AND num_available >= 0));");
  });
}

function create_rentals_table(table_name)  {
  db.serialize(function() {
    // drop existing tables
    db.run("DROP TABLE IF EXISTS " + table_name + ";");

    // create fresh version of table with id as primary key
    db.run("CREATE TABLE rentals (id INTEGER PRIMARY KEY, checkout_date text NOT NULL, return_date text NOT NULL, movie_id integer NOT NULL, customer_id integer NOT NULL, checked_out boolean NOT NULL, FOREIGN KEY(movie_id) REFERENCES movie(id), FOREIGN KEY(customer_id) REFERENCES customer(id));");
  });
}

create_movies_table(movie_table);
create_table(customer_table, customer_fields);
create_rentals_table(rental_table);

db.close();
