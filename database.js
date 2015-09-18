"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

var Database = {
  find_all: function(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + ";";

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
   });
  }
}

module.exports = Database;
