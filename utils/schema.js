"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db = new sqlite3.Database('db/' + db_env + '.db');

  var movie_fields = [
    ['title', 'text'],
    ['overview', 'text'],
    ['release_date', 'text'],
    ['inventory', 'integer']
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
    ['checkout_date', 'text'],
    ['due_date', 'text'],
    ['return_date', 'text'],
    ['overdue', 'integer'],
    ['movie_title', 'text'],
    ['customer_id', 'integer']
  ]

  db.serialize(function() {
    //drop existing
    db.run("DROP TABLE IF EXISTS movies;");
    db.run("DROP TABLE IF EXISTS rentals;");
    db.run("DROP TABLE IF EXISTS customers;");

    //create tables
    db.run("CREATE TABLE movies (id INTEGER PRIMARY KEY);");
    db.run("CREATE TABLE rentals (id INTEGER PRIMARY KEY);");
    db.run("CREATE TABLE customers (id INTEGER PRIMARY KEY);");

    //add columns
    for(var i = 0; i < movie_fields.length; i++) {
      var name = movie_fields[i][0],
          type = movie_fields[i][1];
      db.run("ALTER TABLE movies ADD COLUMN " + name + " " + type + ";");
    }

    for(var j = 0; j < rental_fields.length; j++) {
      var name = rental_fields[j][0],
          type = rental_fields[j][1];
      db.run("ALTER TABLE rentals ADD COLUMN " + name + " " + type + ";");
    }

    for(var k = 0; k < customer_fields.length; k++) {
      var name = customer_fields[k][0],
          type = customer_fields[k][1];
      db.run("ALTER TABLE customers ADD COLUMN " + name + " " + type + ";");
    }
  });

  db.close();
