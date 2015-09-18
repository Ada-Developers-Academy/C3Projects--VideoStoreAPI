"use-strict";
var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

// Here we will define our instance methods
module.exports = {
  query: function(statement, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');

    db.serialize(function() {
      // below: this is the callback pattern...parameters(ERRORS, RESULT)
      db.all(statement, function(err, res) {
        // error handling looks like -> if (err) { };
        if (callback) { callback(res); }
      });
    });

    db.close();
  },

  all: function(callback) {

    this.query("SELECT * FROM " + this.table_name + ";", function(res) {
      callback(res);
    });
  },

 registered_at_sort: function(sort_type, records_per_page, offset, callback) {
   console.log(offset);
   this.query("SELECT * FROM " + this.table_name + " ORDER BY " + sort_type + " LIMIT " + records_per_page + " OFFSET " + offset + ";", function(res) {
     callback(res);
     console.log(res);
   });
 }
}

// We want to export the Database into the overall node structure
