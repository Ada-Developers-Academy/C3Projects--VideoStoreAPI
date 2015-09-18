"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development';

module.exports = {
  find_all: function(callback) {
    var db        = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name;

    db.all(statement, function(err, res) {
      if (callback) { callback(err, res); }
      db.close();
    });
  },

  // get returns one record, making this emulate Active Record's find_by
  find_by: function(column, value, callback) {
    var db        = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + " WHERE " + column + " LIKE ?";

    db.get(statement, value, function(err, res) {
      if (callback) { callback(err, res); }
      db.close();
    });
  },

  // returns array of records
  where: function(columns, values, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var where_statements = [];

    // where_statements => ["city = ?", "state = ?"]
    for (var i = 0; i < columns.length; i++) {
      where_statements.push(columns[i] + " = ?");
    }
    // where_statement => "city = ? AND state = ?"
    var where_statement = where_statements.join(" AND ");

    var statement = "SELECT * FROM " + this.table_name + " WHERE " + where_statement;

    db.all(statement, values, function(err, res) {
      if (callback) { callback(err, res); }
      db.close();
    });
  },

  subset: function(column, queries, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');

    var statement = "SELECT * FROM " + this.table_name + " ORDER BY " + column + " LIMIT ? OFFSET ?";
    console.log(statement);

    db.all(statement, queries, function(err, res) {
      if (callback) { callback(err, res); }
      db.close();
    });
  }

  // get resources/:sort_by/:number/:offset
}
