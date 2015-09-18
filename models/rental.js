"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

function Rental() {
  this.table_name = "rentals";
}

// Rental.prototype = require('../database');
Rental = {
  check_out: function(id, title, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var daysOffset = 7;
    var return_date = new Date(Date.now() + (daysOffset * 24 * 60 * 60 * 1000));
    var movie_id = "SELECT id FROM movies WHERE title =" + title + " ;";
    var statement = "INSERT INTO " + this.table_name + "(return_date, movie_id, customer_id, checked_out) " + "VALUES (" + return_date  + ", " + movie_id + ", " + id + "'true'); ";
  }
};


module.exports = Rental;
