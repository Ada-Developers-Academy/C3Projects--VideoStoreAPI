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

db.serialize(function() {
  // drop existing tables
  db.run("DROP TABLE IF EXISTS movies;");
  // create fresh versions of tables
  db.run("CREATE TABLE movies (id INTEGER PRIMARY KEY);");
  // add columns we need to tables
  for (var i = 0; i < movie_fields.length; i++) {
    var name = movie_fields[i][0],
        type = movie_fields[i][1];

    db.run("ALTER TABLE movies ADD COLUMN " + name + " " + type + ";");
  }
});

db.close();
