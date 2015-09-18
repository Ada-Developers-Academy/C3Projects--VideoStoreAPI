"use-strict";
var sqlite3 = require('sqlite3').verbose();
var Database = require('./database');

function Movie() {}

Movie.prototype = {
  all: function(callback) {
    var db = new Database('./db/development.db');

    db.query("SELECT * FROM movies;", function(res) {
      callback(res);
    });
  }
}

module.exports = Movie;
