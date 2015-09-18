"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development';

function Database(path) {
  this.path = path;
};

Database.prototype.create = function create(data, callback) {
  var db = new sqlite3.Database('db/' + db_env + '.db');
  var keys = Object.keys(data);
  var questionMarks  = [];
  var values = [];

  for (var i = 0; i < keys.length; i++) {
    values.push(data[keys[i]]);
    questionMarks.push("?");
  }

  var statement = "INSERT INTO movies (" + keys.join(", ") + ") VALUES (" + questionMarks.join(", ") + ");";

  db.run(statement, values, function(err) {
    callback(err, { insertedID: this.lastID, changed: this.changes });
    db.close();
  });
}

module.exports = Database;
