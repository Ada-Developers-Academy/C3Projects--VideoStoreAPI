"use strict";

var sqlite3 = require('sqlite3').verbose();

function Models() {
  this.path = "../db/development.db";
}

Customers.prototype = {

}

Customers.prototype = {
  test: function() { console.log('yay! it works!'); },

  query: function(statement, callback) {
    var db = new sqlite3.Customers(this.path);

    db.serialize(function() {
      db.all(statement, function(err, res) {
        if (callback) { callback(res); }
      });
    });

    db.close();
  }
}

module.exports = Customers;
