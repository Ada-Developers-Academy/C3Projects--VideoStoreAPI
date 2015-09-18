"use strict";

var sqlite3 = require("sqlite3").verbose();
  db_env = process.env.DB || 'development';

function Database(path) {
  this.path = path
}

Database.prototype = {
  
}

module.exports = Database;
