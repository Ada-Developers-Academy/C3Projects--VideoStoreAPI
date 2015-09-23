"use strict";

// var sqlite3 = require('sqlite3').verbose(),
//   db_env = process.env.DB || 'development';

var Rental = require('../models/rentals');

var Controller = {
  checkin: function(req, res, next) {
    new Rental().checkInMovie(req.params.title, req.params.customer_id, Controller.send_json.bind(res))
  },

  send_json: function(error, res) {
    if (error) {
      this.status(500).json(error);
    } else {
      this.status(200).json(res);
    }
  }
}

module.exports = Controller

//
// exports.rentalsController = {
//   customers_current: function customers_current(req,res) {
//     var db = new sqlite3.Database('./db/' + db_env + '.db'),
//       results = [],
//       statement = "SELECT DISTINCT customers.id, customers.name FROM customers, rentals WHERE customers.id=rentals.customer_id AND rentals.return_date IS NULL;";
//
//       db.all(statement, function(err, rows) {
//         rows.forEach(function (row) {
//           results.push(row);
//         });
//         db.close();
//         return res.status(200).json(results);
//       });
//   },
//
//   checkedout: function checkedout(req,res) {
//     var db = new sqlite3.Database('./db/' + db_env + '.db'),
//       results = [],
//       title = req.params.title,
//       titleish = '%' + title + '%',
//       statement = "Select customers.id, customers.name, rentals.checkout_date FROM customers, rentals WHERE rentals.customer_id=customers.id AND rentals.movie_title LIKE ? AND rentals.return_date IS NULL;";
//       db.all(statement, [titleish], function(err, rows) {
//         rows.forEach(function (row) {
//           results.push(row);
//         });
//         db.close();
//       return res.status(200).json(results);
//     });
//   },
//
//   title_history: function title_history(req,res) {
//     var db = new sqlite3.Database('./db/' + db_env + '.db'),
//       results = [],
//       title = req.params.title,
//       titleish = '%' + title + '%',
//       statement = "Select customers.id, customers.name, rentals.checkout_date FROM customers, rentals WHERE rentals.customer_id=customers.id AND rentals.movie_title LIKE ? AND rentals.return_date IS NOT NULL ORDER BY rentals.checkout_date DESC;";
//       db.all(statement, [titleish], function(err, rows) {
//         rows.forEach(function (row) {
//           results.push(row);
//         });
//         db.close();
//       return res.status(200).json(results);
//     });
//   },
//
//   id_history: function id_history(req,res) {
//     var db = new sqlite3.Database('./db/' + db_env + '.db'),
//       results = [],
//       title = req.params.title,
//       titleish = '%' + title + '%',
//       statement = "Select customers.id, customers.name, rentals.checkout_date FROM customers, rentals WHERE rentals.customer_id=customers.id AND rentals.movie_title LIKE ? AND rentals.return_date IS NOT NULL ORDER BY rentals.customer_id;";
//       db.all(statement, [titleish], function(err, rows) {
//         rows.forEach(function (row) {
//           results.push(row);
//         });
//         db.close();
//       return res.status(200).json(results);
//     });
//   },
//
//   name_history: function name_history(req,res) {
//     var db = new sqlite3.Database('./db/' + db_env + '.db'),
//       results = [],
//       title = req.params.title,
//       titleish = '%' + title + '%',
//       statement = "Select customers.id, customers.name, rentals.checkout_date FROM customers, rentals WHERE rentals.customer_id=customers.id AND rentals.movie_title LIKE ? AND rentals.return_date IS NOT NULL ORDER BY customers.name;";
//       db.all(statement, [titleish], function(err, rows) {
//         console.log(rows);
//         rows.forEach(function (row) {
//           results.push(row);
//         });
//         db.close();
//       return res.status(200).json(results);
//     });
//   },
//
//   checkout_success: function checkout_success(req,res) {
//     var results = {
//     success: "it works!"
//     }
//   return res.status(200).json(results);
//   },
//
//   checkout: function checkout(req,res) {
//     var db = new sqlite3.Database('./db/' + db_env + '.db'),
//     title = req.params.title,
//     id = req.params.customer_id,
//     insert_statement = "Insert into rentals (checkout_date, due_date, return_date, overdue, movie_title, customer_id) VALUES (date('now'), date('now', '+3 day'), ?, ?, ?, ?);",
//     update_statement = "Update customers SET account_credit = account_credit - 2 WHERE id = ?;";
//     db.run(insert_statement, [null, 0, title, id]);
//     db.run(update_statement, [id]);
//     db.close();
//     var results = [];
//     results.push({message: 'Checkout successful', movie_title: title, customer_id: id});
//     return res.status(200).json(results);
//   },
//
//   checkin: function checkin(req,res) {
//     var db = new sqlite3.Database('./db/' + db_env + '.db'),
//     title = req.params.title,
//     id = req.params.customer_id,
//     statement = "Update rentals SET return_date = date('now'), overdue = (CASE WHEN (date('now') > due_date) THEN 1 ELSE 0 END) WHERE return_date IS NULL AND movie_title = ? AND customer_id = ?;";
//     //if return_date after due_date Set overdue = 1"
//     db.run(statement, [title, id]);
//     db.close();
//     var results = [];
//     results.push({message: 'Check-in successful', movie_title: title, customer_id: id});
//     return res.status(200).json(results);
//   },
//
//   overdue: function overdue(req,res) {
//     var db = new sqlite3.Database('./db/' + db_env + '.db'),
//         results = [],
//         statement = "SELECT customers.id, customers.name, rentals.movie_title from customers, rentals WHERE customers.id=rentals.customer_id AND (rentals.overdue = 1 OR ( date('now')>rentals.due_date AND rentals.return_date IS NULL));";
//     db.all(statement, function(err, rows) {
//         rows.forEach(function (row) {
//           results.push(row);
//         });
//         db.close();
//       return res.status(200).json(results);
//     });
//   }
// }
