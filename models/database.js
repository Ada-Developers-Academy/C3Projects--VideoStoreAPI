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
  });
}

// OPTIMIZE / TODO: this can only search by one parameter at a time, and only with an `=` relationship.
Database.prototype.findBy = function findBy(parameter, value, callback) {
  // check that the parameter is a valid parameter (e.g. make sure it's not sql injection)
  if (!this._validParam(parameter)) {
    callback(new Error('Error: syntax error. Unrecognized parameter.'));
    return;
  }

  var db = this.openDB();
  var statement = 'SELECT * FROM ' + this.tableName + ' WHERE ' + parameter + ' LIKE ?;';

  db.all(statement, value, function(err, rows) {
    if (err) { console.log('!!!!ERROR!!!! In Database#findBy'); } // FIXME: how is error tracking best handled?

    callback(err, rows);
    db.close();
  });
}

Database.prototype.sortBy = function sortBy(parameter, n, p, callback) {
  var db = this.openDB();

  if (!this._validParam(parameter)) {
    callback(new Error('Error: syntax error. Unrecognized parameter.'));
    return;
  }

  if (n == null) {
    var statement = 'SELECT * FROM ' + this.tableName + ' ORDER BY ' + parameter + ';';
  } else if (p > 1){
    var offset = n * (p - 1);
    var statement = 'SELECT * FROM ' + this.tableName + ' ORDER BY ' + parameter + ' LIMIT ' + n + ' OFFSET ' + offset + ';';
  } else {
    var statement = 'SELECT * FROM ' + this.tableName + ' ORDER BY ' + parameter + ' LIMIT ' + n + ';';
  }

  db.all(statement, function(err, rows) {
    callback(err, rows);
    db.close();
  });
}

Database.prototype._validParam = function _validParam(parameter) {
  parameter = parameter.toLowerCase();

  for (var i = 0; i < this.columnNames.length; i++) {
    if (this.columnNames[i] == parameter) {
      return true;
    }
  }
  return false;
}

module.exports = Database;
