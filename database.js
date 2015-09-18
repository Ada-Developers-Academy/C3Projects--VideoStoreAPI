"use strict";

var sqlite3 = require('sqlite3').verbose();

function StoreDatabase(path) {
  this.path = path;
}

StoreDatabase.prototype = {
  query: function(statement, callback) {
    var db = new sqlite3.Database(this.path); // creates a connection to the db

    db.serialize(function() {
      // statement == some SQL string
      db.all(statement, function(err, res) {
        // we only get a callback if it's successful
        if (callback) { callback(res); }
      });
    });

    db.close();
  }
};

module.exports = StoreDatabase;
