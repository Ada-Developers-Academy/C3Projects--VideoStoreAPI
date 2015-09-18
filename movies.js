"use-strict";
var sqlite3 = require('sqlite3').verbose();

function Movie() {
  this.table_name = "movies";
}

Movie.prototype = require('./database');

module.exports = Movie;
