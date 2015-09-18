"use-strict";
var sqlite3 = require('sqlite3').verbose();

function Database(path) { // this creates our database class
  this.path = path;
}

// Here we will define our instance methods
Database.prototype = {
  query: function(statement, callback) {
    var db = new sqlite3.Database(this.path);

    db.serialize(function() {
      // below: this is the callback pattern...parameters(ERRORS, RESULT)
      db.all(statement, function(err, res) {
        // error handling looks like -> if (err) { };
        if (callback) { callback(res); }
      });
    });

    db.close();
  },

  test: function() {
    return "yay, it works!";
  }
}

// We want to export the Database into the overall node structure
module.exports = Database;
