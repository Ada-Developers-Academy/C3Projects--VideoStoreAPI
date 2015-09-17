"use strict";

var sqlite3 = require('sqlite3').verbose();

function Database(path) {
  this.path = path;
}

module.exports = Database;
