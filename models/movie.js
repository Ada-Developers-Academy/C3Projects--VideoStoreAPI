"use strict";

var sqlite3 = require('sqlite3').verbose();

function Movie() {
  this.tableName = 'movies';
  this.columnNames = [
    'title', // TEXT NOT NULL UNIQUE
    'overview', // TEXT
    'release_date', // TEXT
    'inventory integer' // INTEGER NOT NULL DEFAULT 0
  ];
}

// this is silly-ish, but necessary because of how we set up the DB object
Movie.prototype = require('./database').prototype;

module.exports = Movie;
