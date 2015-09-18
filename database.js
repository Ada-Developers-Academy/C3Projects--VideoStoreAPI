"use strict";

var sqlite3 = require('sqlite3').verbose();

function Database(path) {
  this.path = path;
}

Database.prototype = {
  find_all: function(callback) {
    var db = new sqlite3.Database(this.path);
    var statement = "SELECT * FROM " + this.table_name + ";";

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
   });
  }
}

module.exports = Database;
