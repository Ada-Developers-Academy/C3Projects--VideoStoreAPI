"use strict";

var sqlite3 = require('sqlite3').verbose();

function StoreDatabase(path) {
  this.path = path;
}

StoreDatabase.prototype = {
  query: function(statement, callback) {
    var db = new sqlite3.Database(this.path); // creates a connection to the db

    db.serialize(function() {
      db.all(statement, function(err, res) { // statement == some SQL string
        if (callback) { callback(res); } // we only get a callback if it's successful
      });
    });
  
    db.close();
  }
};

module.exports = StoreDatabase;