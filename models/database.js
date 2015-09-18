"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db_path = 'db/' + db_env + '.db';

function Database() {};

Database.prototype.dbPath = function dbPath() {
  return db_path;
}

Database.prototype.create = function create(data, callback) {
  var db = new sqlite3.Database(this.dbPath());
  var keys = Object.keys(data);
  var questionMarks  = [];
  var values = [];

  for (var i = 0; i < keys.length; i++) {
    values.push(data[keys[i]]);
    questionMarks.push("?");
  }

  var statement = "INSERT INTO " + this.tableName + " (" + keys.join(", ") + ") VALUES (" + questionMarks.join(", ") + ");";

  db.run(statement, values, function(err) {
    callback(err, { insertedID: this.lastID, changed: this.changes });
    db.close();
  });
}

module.exports = Database;
