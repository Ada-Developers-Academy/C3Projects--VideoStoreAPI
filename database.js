"use-strict";
var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

// Here we will define our instance methods
module.exports = {
  query: function(statement, callback) { // shared
    var db = new sqlite3.Database('db/' + db_env + '.db');
    db.serialize(function() {
      // below: this is the callback pattern...parameters(ERRORS, RESULT)
      db.all(statement, function(err, res) {
        // console.log(statement);
        // console.log(err);
        // error handling looks like -> if (err) { };
        if (callback) { callback(res); }
      });
    });

    db.close();
  },

  all: function(callback) { // shared
    this.query("SELECT * FROM " + this.table_name + ";", function(res) {
      callback(res);
    });
  },

  sort_by: function(sort_type, records_per_page, offset, callback) { // shared
    this.query("SELECT * FROM " + this.table_name + " ORDER BY " + sort_type + " LIMIT " + records_per_page + " OFFSET " + offset + ";", function(res) {
     callback(res);
    });
  },

  formatDate: function(date) { // shared
    var dateObj = new Date(date);
    var month = (dateObj.getUTCMonth() + 1).toString(); //months from 1-12
    var day = (dateObj.getUTCDate()).toString();
    var year = (dateObj.getUTCFullYear()).toString();
    var newDate;

    if (month.length == 1) { // This will ensure month is two digits
      month = "0" + month;
    }

    if (day.length == 1) { // This will ensure day is two digits
      day = "0" + day;
    }

    return parseInt(year + month + day);
  }
};
