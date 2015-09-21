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
    if (err) {
      callback(err, { insertedID: null, changed: null });
    } else {
      callback(err, { insertedID: this.lastID, changed: this.changes });
    }

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

// OPTIMIZE / TODO: this can only search by one parameter at a time, and only with an `=` relationship.
Database.prototype.findBy = function findBy(parameter, value, callback) {
  // FIXME: it'd be nice to have a security check that the parameter is a valid parameter (e.g. make sure it's not sql injection)
  var db = this.openDB();
  var statement = 'SELECT * FROM ' + this.tableName + ' WHERE ' + parameter + ' LIKE ?;';

  db.all(statement, value, function(err, rows) {
    if (err) { console.log('!!!!ERROR!!!! In Database#findBy'); } // FIXME: how is error tracking best handled?

    callback(err, rows);
    db.close();
    statement.finalize();
  });
}

Database.prototype.sortBy = function sortBy(parameter, n, callback) {
  var db = this. openDB();

  if (typeof n === "string" && n.toLowerCase() === 'all') {
    var statement = 'SELECT * FROM ' + this.tableName + ' ORDER BY ?;';
    var values = parameter;
  } else {
    var statement = 'SELECT * FROM ' + this.tableName + ' ORDER BY ? LIMIT ?;';
    var values = [parameter, n];
  }

  db.all(statement, values, function(err, rows) {
    callback(err, rows);
    db.close();
  });
}

module.exports = Database;
