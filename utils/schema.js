"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db = new sqlite3.Database('db/' + db_env + '.db');

var movie_fields = [
  ['title', 'text'],
  ['overview', 'text'],
  ['release_date', 'text'],
  ['inventory', 'integer'],
  ['available', 'integer']
]

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

var rental_fields = [
  ['movie_id', 'integer'],
  ['customer_id', 'integer'],
  ['returned_date', 'text'],
  ['checked_out', 'text']
]

function set_tables(table, table_fields) {
  db.serialize(function() {
    // drop existing tables
    db.run("DROP TABLE IF EXISTS " + table + ";");
    // create fresh versions of tables
    db.run("CREATE TABLE " + table + " (id INTEGER PRIMARY KEY);");
    // add columns we need to tables
    for (var i = 0; i < table_fields.length; i++) {
      var name = table_fields[i][0],
          type = table_fields[i][1];

      db.run("ALTER TABLE " + table + " ADD COLUMN " + name + " " + type + ";");
    }
  });
}

set_tables(" movies ", movie_fields);
set_tables(" customers ", customer_fields);
set_tables(" rentals ", rental_fields);

db.close();
