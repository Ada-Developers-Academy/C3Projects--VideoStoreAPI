"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');

// FOR REFERENCE:
// var movie_fields = [
//   ['title', 'text'],
//   ['overview', 'text'],
//   ['release_date', 'text'],
//   ['inventory', 'integer']
// ];
//
// db.serialize(function() {
//   db.run("DROP TABLE IF EXISTS movies;");
//   db.run("CREATE TABLE movies (id INTEGER PRIMARY KEY);");
//
//   for(var i = 0; i < movie_fields.length; i++) {
//     var name = movie_fields[i][0];
//     var type = movie_fields[i][1];
//
//     db.run("ALTER TABLE movies ADD COLUMN " + name + " " + type + ";");
//   }
// });

db.close();
