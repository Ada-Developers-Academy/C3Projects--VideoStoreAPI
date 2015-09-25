"use strict";
var sqlite3 = require("sqlite3").verbose(),
    db_env = process.env.DB || 'development';

function Rental() {
  this.table_name = "rentals";
}

function yyyymmdd(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
  var dd = date.getDate().toString();
  return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
}

Rental.prototype = require('../database');

// Data should be an object with keys of customer_id and movie_title
Rental.prototype.check_out = function(data, callback){
  var db = new sqlite3.Database('db/'+ db_env + '.db');
  var checkoutLengthDays = 4;
  var now = new Date();
  var due = new Date(now);
  var rental_cost = 5
  var late_fee = 3
  var id = data.customer_id;
  var title = data.movie_title
  due.setDate(now.getDate()+checkoutLengthDays);

  var insert_statement = "INSERT INTO rentals (check_out_date, expected_return_date, customer_id, movie_id) VALUES (?,?,?,(SELECT id FROM movies where title LIKE ?))";

  var charge_statement = "UPDATE customers SET account_credit=(account_credit-" +rental_cost+") WHERE id=?";

  var check_inventory_statement = "SELECT movies.inventory-(SELECT COUNT(*) from rentals  WHERE rentals.movie_id=movies.id AND check_in_date IS NULL) AS available from movies WHERE title LIKE ?";

  db.all(check_inventory_statement, title, function(err, result){
    if (result[0].available > 0) {
      db.run(insert_statement, yyyymmdd(now), yyyymmdd(due), id, title, function(err, rows) {
        if (err !== null) {
          console.log(err);
        }
      });
      db.run(charge_statement, id, function(err, res) {
          if (err !== null) {
            console.log(err);
          }
          result = { "result": "Successful", "message": "Rental created" };
          if (callback) callback(err, result);
          db.close();
      });
    }
    else {
      var res = { "result": "Unsuccessful", "message": "Not enough inventory to complete rental" };
      if (callback) callback(err, res);
      db.close();
    }
  });
};

module.exports = Rental;
