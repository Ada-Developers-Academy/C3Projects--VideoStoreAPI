"use strict";

function Rental() {
  this.table_name = "rentals";
}

Rental.prototype = require('../database');

// Rental.prototype.find_checked_out = function(callback) {
//   var db = new sqlite3.Database('db/' + db_env + '.db');
//   var currently_checked_out_movies_statement =
//     "SELECT * FROM rentals WHERE customer_id = " + id +
//     " AND check_in_date = \"\";";
//   var returned_movies_statement =
//     "SELECT * FROM rentals WHERE customer_id = " + id +
//     " AND check_in_date != \"\";";
//
//   db.all(currently_checked_out_movies_statement, function(err, res1) {
//     db.all(returned_movies_statement, function(err, res2) {
//       var result = {
//         "result1": res1,
//         "result2": res2
//       };
//       console.log(result);
//       if (callback) callback(err, result);
//
//       db.close();
//     }
//   });
// };

module.exports = Rental;
