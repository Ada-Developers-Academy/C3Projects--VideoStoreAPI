"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development';

exports.rentalsController = {
  customers_current: function customers_current(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db'),
      results = [],
      statement = "SELECT DISTINCT customers.id, customers.name FROM customers, rentals WHERE customers.id=rentals.customer_id AND rentals.return_date IS NULL;";

      db.all(statement, function(err, rows) {
        rows.forEach(function (row) {
          results.push(row);
        });
        db.close();
        return res.status(200).json(results);
      });
  },

  checkedout: function checkedout(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db'),
      results = [],
      title = req.params.title,
      titleish = '%' + title + '%',
      statement = "Select customers.id, customers.name, rentals.checkout_date FROM customers, rentals WHERE rentals.customer_id=customers.id AND rentals.movie_title LIKE ? AND rentals.return_date IS NULL;";
      db.all(statement, [titleish], function(err, rows) {
        rows.forEach(function (row) {
          results.push(row);
        });
        db.close();
      return res.status(200).json(results);
    });
  },

  title_history: function title_history(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db'),
      results = [],
      title = req.params.title,
      titleish = '%' + title + '%',
      statement = "Select customers.id, customers.name, rentals.checkout_date FROM customers, rentals WHERE rentals.customer_id=customers.id AND rentals.movie_title LIKE ? AND rentals.return_date IS NOT NULL ORDER BY rentals.checkout_date DESC;";
      db.all(statement, [titleish], function(err, rows) {
        rows.forEach(function (row) {
          results.push(row);
        });
        db.close();
      return res.status(200).json(results);
    });
  },

  id_history: function id_history(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db'),
      results = [],
      title = req.params.title,
      titleish = '%' + title + '%',
      statement = "Select customers.id, customers.name, rentals.checkout_date FROM customers, rentals WHERE rentals.customer_id=customers.id AND rentals.movie_title LIKE ? AND rentals.return_date IS NOT NULL ORDER BY rentals.customer_id;";
      db.all(statement, [titleish], function(err, rows) {
        rows.forEach(function (row) {
          results.push(row);
        });
        db.close();
      return res.status(200).json(results);
    });
  },

  name_history: function name_history(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db'),
      results = [],
      title = req.params.title,
      titleish = '%' + title + '%',
      statement = "Select customers.id, customers.name, rentals.checkout_date FROM customers, rentals WHERE rentals.customer_id=customers.id AND rentals.movie_title LIKE ? AND rentals.return_date IS NOT NULL ORDER BY customers.name;";
      db.all(statement, [titleish], function(err, rows) {
        rows.forEach(function (row) {
          results.push(row);
        });
        db.close();
      return res.status(200).json(results);
    });
  },

  checkout_success: function checkout_success(req,res) {
    var results = {
    success: "it works!"
    }
  return res.status(200).json(results);
  },

  checkout: function checkout(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db'),
    title = req.params.title,
    id = req.params.customer_id,
    statement = "Insert into rentals VALUES (?, ?, ?, ?, ?, ?);";

    var checkout_date = new Date();
    var due_date= new Date(checkout_date);
      due_date.setDate(checkout_date.getDate()+3);
      console.log(title, id, checkout_date, due_date);

    db.run(statement, [checkout_date, due_date, null, 0, title, id]);
    db.close();
  },

  checkin: function checkin(req,res) {
    var results = {
      // check if return_date == nil
      // update rentals table for given customer_id and movie_title (only works if exact) return date = Date.now
      // overdue check is due date before date.now, overdue == 1, else ==0
    }
  return res.status(200).json(results);
  },

  overdue: function overdue(req,res) {
    var results = {
      // customers where overdue ==1, add
      // customers where return_date = nil, if Date.now is after due_date
    }
  return res.status(200).json(results);
  }
}
