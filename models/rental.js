"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

function Rental() {
  this.table_name = "rentals";
}

// Rental.prototype = require('../database');
Rental.prototype = {
  check_out: function(id, title, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var rental_duration_days = 7;
    var return_date = new Date(Date.now() + (rental_duration_days * 24 * 60 * 60 * 1000));
    var movie_id = 1;

    // have to actually *run* the sqlite3 query and get result... above doesn't do that...
    // not sure if this works either. Seems to return a db connection object...WIP


    // var movie_id = function() {
    //   db.get("SELECT id FROM movies WHERE title = '" + title + "';");
    //   return this.lastID; //in callback?
    // };
    // console.log(movie_id());


    // db.serialize(function() {
      // db.run("SELECT id FROM movies WHERE title = '" + title + "';"), function(err) {
      //   // console.log(this.lastID);
      //   callback(err, { movie_id: this.lastID });
      // };
      //
      var statement = "INSERT INTO " + this.table_name + " (return_date, movie_id, customer_id, checked_out) " + "VALUES (" + return_date  + ", " + movie_id + ", " + id + ", 'true'); ";

      db.run(statement, function(err) {
        callback(err, { inserted_id: this.lastID, changed: this.changes });
      });
      db.close();
    // })


    //
    // db.all(statement, function(err, res) {
    //   if (callback) callback(err, res);
    //   db.close();
    // });
  }
};

module.exports = Rental;
