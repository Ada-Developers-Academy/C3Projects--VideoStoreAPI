"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development';

  function Rental() {
   this.table_name = "rentals";
  }

  Rental.prototype = require("./database");

  Rental.prototype.customers_current = function customers_current(callback) {
    var db = new sqlite3.Database('./db/' + db_env + '.db'),
    statement = "SELECT DISTINCT customers.id, customers.name FROM customers, rentals WHERE customers.id=rentals.customer_id AND rentals.return_date IS NULL;";

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
      });
  }

  Rental.prototype.checkout_history = function checkout_history(title, returned, ordered, callback) {
    var db = new sqlite3.Database('./db/' + db_env + '.db'),
    titleish = '%' + title + '%',
    statement = "Select customers.id, customers.name, rentals.checkout_date FROM customers, rentals WHERE rentals.customer_id=customers.id AND rentals.movie_title LIKE ? AND rentals.return_date " + returned + ordered;

    db.all(statement, [titleish], function(err, res) {
      if (callback) callback(err, res);
      db.close();
    })
  }

  Rental.prototype.checkInMovie = function checkInMovie(title, id, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db'),
        update_statement = "Update rentals SET return_date = date('now'), overdue = (CASE WHEN (date('now') > due_date) THEN 1 ELSE 0 END) WHERE return_date IS NULL AND movie_title = ? AND customer_id = ?;",
        select_statement = "SELECT rentals.due_date, rentals.return_date, rentals.overdue, rentals.movie_title, rentals.customer_id, customers.account_credit FROM rentals, customers WHERE rentals.customer_id=customers.id AND rentals.customer_id=? AND rentals.movie_title=? AND return_date=date('now')",
        charge_statement = "Update customers SET account_credit = (account_credit - 5) WHERE id=?";

    db.run(update_statement, [title, id]);
    db.all(select_statement, [id, title], function(err, res) {
      if (res[0].overdue == 1) {
        db.run(charge_statement, [id]);
      }
      res.push({message: 'Checkin successful'});
      if (callback) callback(err, res);
      db.close();
    })
  }

  Rental.prototype.overdue = function overdue(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db'),
      statement = "SELECT customers.id, customers.name, rentals.movie_title from customers, rentals WHERE customers.id=rentals.customer_id AND (rentals.overdue = 1 OR ( date('now')>rentals.due_date AND rentals.return_date IS NULL));";
    db.all(statement, function(err, res) {

      if (callback) callback(err, res);
      db.close();
    })
  }

  Rental.prototype.checkoutMovie = function checkoutMovie(title, id, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db'),
        insert_statement = "Insert into rentals (checkout_date, due_date, return_date, overdue, movie_title, customer_id) VALUES (date('now'), date('now', '+3 day'), ?, ?, ?, ?);",
        update_statement = "Update customers SET account_credit = account_credit - 2 WHERE id = ?;",
        select_statement = "SELECT customers.name, customers.account_credit, rentals.movie_title, rentals.due_date FROM customers, rentals WHERE customers.id=? AND rentals.customer_id=? AND rentals.movie_title=? AND rentals.due_date=date('now', '+3 day')";

    db.run(insert_statement, [null, 0, title, id]);
    db.run(update_statement, [id]);
    db.all(select_statement, [id, id, title], function(err, res) {
        res.push({message: 'Checkout successful'})
        if (callback) callback(err, res);
        db.close();
      })
  }
module.exports = Rental
