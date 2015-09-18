"use strict";

var sqlite3 = require('sqlite3').verbose();

function Database(path) {
  this.path = path;
}

Database.prototype = {
  query: function() {
    var db = new sqlite3.Database(this.path);

    db.serialize(function() {
      var movies = db.run("SELECT * FROM movies;");
    });
    db.close();
  }
}

module.exports = Database;
