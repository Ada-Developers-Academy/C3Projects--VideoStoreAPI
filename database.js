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
  },

  by_column: function(column, number, page, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT " + column + " FROM " + this.table_name + " LIMIT " + number + " OFFSET " + page + ";";

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  customers_by_movie_current: function(title, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    // all customers' rentals for that movie
    var get_rentals_statement = "SELECT * FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id WHERE rentals.movie_id = (SELECT movies.id FROM movies WHERE movies.title = ? COLLATE NOCASE LIMIT 1) AND rentals.checked_out = 'true'; ";

      db.all(get_rentals_statement, title, function(err, rows) {

        callback(err, rows);
        db.close();
      });
    }
  // }
};

module.exports = Database;
