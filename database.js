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
      db.all(statement, function(err, result) {
        // we only get a callback if it's successful
        if (callback) { callback(err, result); }

        db.close();
      });
    
    });
  },

  multi_query: function(statement, callback) {
    var db = new sqlite3.Database(this.path); // creates a connection to the db

    db.serialize(function() {
      // statement == some SQL string
      db.exec(statement, function(err, result) {
        // '.exec' does not give a result, so we don't need to pass it back into the callback()
        if (callback) { callback(err); }

        db.close();
      });
    
    });
  }
};

module.exports = StoreDatabase;
