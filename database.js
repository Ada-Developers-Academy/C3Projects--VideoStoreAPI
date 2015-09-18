"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development';

module.exports = {
  find_all: function(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + ";";

     db.all(statement, function(err, record) {
      if (callback) callback(err, record);
      db.close();
    });
  },

  find_subset: function(column, limit, offset, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + " ORDER BY " + column + " LIMIT " + limit + " OFFSET " + offset + ";";

    db.all(statement, function(err, record) {
      if (callback) callback(err, record);
      db.close();
    });
  },

  find_by: function(column, value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + " WHERE " + column + "= ?;";

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  }
}
