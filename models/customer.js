"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

function Customer() {
  this.table_name = "customers";
}

Customer.prototype = require('../database');

// var customerVariable = {
//   checked_out_movies: function(id, callback) {
//     var db = new sqlite3.Database('db/' + db_env + '.db');
//     var get_rentals_statement = "SELECT movie_id FROM rentals INNER JOIN customers ON rentals.customer_id = customers.id WHERE customer_id = " + id + " ;";
//     var get_movies_statement = "SELECT * FROM movies INNER JOIN rentals ON movies.id = rentals.movie_id WHERE movie_id = ?;";
//
//     db.serialize(function() {
//       // var data = {};
//       var rowset = db.each(get_rentals_statement, function(err, row) {
//         db.get(get_movies_statement, row.movie_id, function(err, row) {
//           callback(err);
//
//         });
//       });
//       console.log(rowset);
//     });
//   }
//   // var data = '{ "' + row.movie_id + '" }';
// };
module.exports = Customer;
