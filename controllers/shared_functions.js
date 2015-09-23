"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development';

var db = new sqlite3.Database('./db/' + db_env + '.db');
var results = [];

// function all_call(db, results, statement, res) {
//   db.all(statement, function(err, rows) {
//     rows.forEach(function (row) {
//       results.push(row);
//     });
//     db.close();
//     return res.status(200).json(results);
//   });
// }

module.exports = sqlite3, db, results;
