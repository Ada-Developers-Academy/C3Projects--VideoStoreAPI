"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

var movie_fields = [
  ['title', 'text'],
  ['overview', 'text'],
  ['release_date', 'text'],
  ['inventory', 'integer']
];

var customer_fields = [
  ['name', 'text'],
  ['registered_at', 'text'],
  ['address', 'text'],
  ['city', 'text'],
  ['state', 'text'],
  ['postal_code', 'text'],
  ['phone', 'text'],
  ['account_credit', 'integer'] // multiplied by 100 to be stored as cents
];

var rental_fields = [
  ['customer_id', 'integer'],
  ['movie_id', 'integer'],
  ['checkout_date', 'text'],
  ['return_date', 'text'],
  ['returned', 'text'] // boolean
];

function reset(table_name, table_fields) {
  db.serialize(function() {
    db.run("DROP TABLE IF EXISTS " + table_name + ";");

    // create fresh versions of those tables
    db.run("CREATE TABLE " + table_name + " (id INTEGER PRIMARY KEY);");

    // add columns that I need to those tables
    for (var i = 0; i < table_fields.length; i++) {
      var name = table_fields[i][0],
          type = table_fields[i][1];

      // ALTER TABLE movies ADD COLUMN title text;
      db.run("ALTER TABLE " + table_name + " ADD COLUMN " + name + " " + type + ";");
    };
  });
}

reset("movies", movie_fields);
reset("customers", customer_fields);
reset("rentals", rental_fields);

db.close();
