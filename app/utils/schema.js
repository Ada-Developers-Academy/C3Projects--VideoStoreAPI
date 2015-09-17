"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db = new sqlite3.Database('db/' + db_env + '.db'); // creates db connection

var movie_table = "movies";
var movie_fields = [
  ['title', 'text'],
  ['overview', 'text'],
  ['release_date', 'text'],
  ['inventory', 'integer']
];

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

function create_table(table_name, table_fields)  {
  db.serialize(function() {
    // drop existing tables
    db.run("DROP TABLE IF EXISTS " + table_name + ";");

    // create fresh version of table with id as primary key
    db.run("CREATE TABLE " + table_name + " (id INTEGER PRIMARY KEY);");

    // add columns to those tables
    for(var i = 0; i < table_fields.length; i++) {
      var name = table_fields[i][0],
          type = table_fields[i][1];

      db.run("ALTER TABLE " + table_name + " ADD COLUMN " + name + " " + type + ";");
    }
  });
}

create_table(movie_table, movie_fields);
create_table(customer_table, customer_fields);

db.close();
