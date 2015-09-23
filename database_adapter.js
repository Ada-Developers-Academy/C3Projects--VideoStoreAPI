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

  where_in: function(column, valueList, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var questionMarks = Array(valueList.length + 1).join('?').split('').join(', ');

    var statement = "SELECT * FROM " + this.table_name + " WHERE " + column + " IN (" + questionMarks + ");";

    db.all(statement, valueList, function(error, result) {
      if (callback) { callback(error, result); }
      db.close();
    });
  },

  subset: function(column, queries, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');

    var statement = "SELECT * FROM " + this.table_name + " ORDER BY " + column + " LIMIT ? OFFSET ?";

    db.all(statement, queries, function(err, res) {
      if (callback) { callback(err, res); }
      db.close();
    });
  },

  order_by: function(column, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');

    var statement = "SELECT * FROM " + this.table_name + " ORDER BY " + column;

    db.all(statement, function(err, res) {
      if (callback) { callback(err, res); }
      db.close();
    });
  },

  // Example route:
  // customers/create/:name/:registered_at/:address/:city/:state/:postal_code/:phone
  create: function(columns, values, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var column_names = columns.join(', ');
    var question_marks =  Array(columns.length + 1).join('?').split('').join(', ');

    var statement = "INSERT INTO " + this.table_name + " (" + column_names + ") \
    VALUES (" + question_marks + ");";

    db.run(statement, values, function(err, res) {
      if (callback) { callback(err, { inserted_id: this.lastID }); }
      db.close();
    });
  },

  // Example route:
  // customers/update/:id?name=name&city=city&state=state
  update: function(id, columns, values, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // eg. "column1 = ?, column2 = ?, column3 = ?"
    var columnsQueries = [];

    for (var i = 0; i < columns.length; i++) {
      columnsQueries.push(columns[i] + " = ?");
    };

    var update_statement = columnsQueries.join(', ');

    var statement = "UPDATE " + this.table_name + " SET " + update_statement + "WHERE id = " + id + ";";

    db.run(statement, values, function(err, res) {
      if (callback) { callback(err, { changes: this.changes }); }
      db.close();
    });
  }
}
