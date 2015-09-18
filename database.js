"use strict";

var sqlite3 = require("sqlite3").verbose(),
    db_env = process.env.DB || 'development';

module.exports = {
  all: function(callback){
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + ";";

    db.all(statement, value, function(err, res){
      if (callback) callback(err, res);
      db.close();
    });
  },

  find_by: function(column, value, callback){
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + " WHERE " + column + " = ?;";

    db.all(statement, value, function(err, res){
      if (callback) callback(err, res);
      db.close();
    });
  },
}
