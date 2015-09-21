"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db_path = 'db/' + db_env + '.db';

function Database() {};

Database.prototype.openDB = function openDB() {
  return new sqlite3.Database(this.dbPath());
}

Database.prototype.dbPath = function dbPath() {
  return db_path;
}

Database.prototype.create = function create(data, callback) {
  var db = this.openDB();
  var keys = Object.keys(data);
  var questionMarks = [];
  var values = [];

  for (var i = 0; i < keys.length; i++) {
    values.push(data[keys[i]]);
    questionMarks.push("?");
  }

  var statement = "INSERT INTO " + this.tableName + " (" + keys.join(", ") + ") VALUES (" + questionMarks.join(", ") + ");";

  db.run(statement, values, function(err) {
    // TODO / FIXME: if there's an error, `this` doesn't exist / doesn't have #lastID or #changes
    callback(err, { insertedID: this.lastID, changed: this.changes });
    db.close();
  });
}

Database.prototype.all = function all(callback) {
  var db = this.openDB();
  var statement = 'SELECT * FROM ' + this.tableName + ';';

  db.all(statement, function(err, rows) {
    if (err) { console.log('!!!!ERROR!!!! In Database#all.'); } // FIXME: how is error tracking best handled?

    callback(err, rows);
    db.close();
    statement.finalize();
  });
}

module.exports = Database;
