"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

var data = [
  {
    name: 'movies',
    fields: [
      'title TEXT NOT NULL UNIQUE',
      'overview TEXT',
      'release_date TEXT',
      'inventory integer NOT NULL DEFAULT 0'
    ]
  },
  {
    name: 'customers',
    fields: [
      'name TEXT NOT NULL',
      'registered_at TEXT',
      'address TEXT',
      'city TEXT',
      'state TEXT',
      'postal_code TEXT',
      'phone TEXT',
      'account_balance integer NOT NULL DEFAULT 0'
    ]
  },
  {
    name: 'rentals',
    fields: [
      'checkout_date TEXT NOT NULL DEFAULT CURRENT_DATE',
      'return_date TEXT',
      'movie_title TEXT NOT NULL',
      'customer_id INTEGER NOT NULL',
      'FOREIGN KEY(movie_title) REFERENCES movies(title)',
      'FOREIGN KEY(customer_id) REFERENCES customers(id)'
    ]
  }
];

db.serialize(function() {
  for (var i = 0; i < data.length; i++) {
    var table = data[i];

    db.run("DROP TABLE IF EXISTS " + table.name + ";");

    var statement = "CREATE TABLE " + table.name + " (id INTEGER PRIMARY KEY";
    for (var j = 0; j < table.fields.length; j++) {
      statement += ", " + table.fields[j];
    }
    statement += ");"
    db.run(statement);
  }
});

db.close();
