"use strict";

var sqlite3 = require('sqlite3').verbose();

function Movie() {
  this.test = 'Test';
  this.tableName = "movies";
};

// this is silly-ish, but necessary because of how we set up the DB object
Movie.prototype = require('./database').prototype;

module.exports = Movie;
