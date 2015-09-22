"use strict";
var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');
var Movie = require('../models/movies');
var Customer = require('../models/customers');
var Rental = require('../models/rentals');

// Convert a JavaScript Date to a string in yyyymmdd format
// function yyyymmdd(date) {
//   var yyyy = date.getFullYear().toString();
//   var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
//   var dd = date.getDate().toString();
//   return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
// }

exports.rentalsController = {
  // GET /rentals
  getAllRentals: function(res) {
    db.all("SELECT * FROM rentals ", function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // GET /rentals/overdue
  // movies and the customer associated with it
  getAllOverdue:function(res) {
    db.all("SELECT customers.name, movies.title FROM rentals INNER JOIN customers on customers.id = rentals.customer_id INNER JOIN movies on movies.id = rentals.movie_id WHERE check_in_date IS NULL AND date(expected_return_date) < date('now')", function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // GET /rentals/currently_out
  getAllCurrentlyOut:function(res) {
    db.all("SELECT customers.name, movies.title FROM rentals INNER JOIN customers on customers.id = rentals.customer_id INNER JOIN movies on movies.id = rentals.movie_id WHERE check_in_date IS NULL", function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // GET /rentals/available_inventory
  getAvailableInventory:function(res) {
    db.all("SELECT movies.title, movies.inventory-(SELECT COUNT(*) from rentals WHERE rentals.movie_id=movies.id AND check_in_date IS NULL) AS available from movies", function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // GET /rentals/current_renters/:title
  getAllCurrentRenters:function(title, res) {
    db.all("SELECT customers.name from rentals INNER JOIN movies ON movies.id = rentals.movie_id INNER JOIN customers on customers.id = rentals.customer_id WHERE movies.title LIKE ? AND check_in_date IS NULL", title, function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // POST rentals/check_in?id=XXX&title=XXX
  checkIn:function(id, title, res) {

    var now = new Date();
    //TODO: See if we can limit this to updating one row if multiple match
    // (The same customer had checked out multiple copies of the same movie)
    db.run("UPDATE rentals SET check_in_date=? WHERE customer_id=? AND movie_id=(SELECT id FROM movies where title LIKE ?)", yyyymmdd(now), id, title, function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
    });

    // TODO: Charge a late fee if now > expected_return_date
    /*
    db.run("UPDATE customers SET account_credit=(account_credit-5) WHERE id=?", id, function(err, rows) {
        if (err !== null) {
          console.log(err);
        }
    });
    */

    res.status(200).json([]);
  },

  // POST rentals/check_out?id=XXX&title=XXX
  // checkOut:function(id, title, res) {
  //   var checkoutLengthDays = 4;
  //   var now = new Date();
  //   var due = new Date(now);
  //   var rental_cost = 5
  //   var late_fee = 3
  //   due.setDate(now.getDate()+checkoutLengthDays);
  //
  //   db.run("INSERT INTO rentals (check_out_date, expected_return_date, customer_id, movie_id) VALUES (?,?,?,(SELECT id FROM movies where title LIKE ?))", yyyymmdd(now), yyyymmdd(due), id, title, function(err, rows) {
  //     if (err !== null) {
  //       console.log(err);
  //     }
  //   });
  //
  //   db.run("UPDATE customers SET account_credit=(account_credit-rental_cost) WHERE id=?", id, function(err, rows) {
  //       if (err !== null) {
  //         console.log(err);
  //       }
  //   });
  //
  //   res.status(200).json([]);
  // },

  // POST /rentals/check_out(cust id, movie title) (math for checkout cost)
  // creating a new rental with no returned date
  create: function(req, res) {
    var data = req["body"]
    var db = new Customer();

    db.check_out(data, function(err, result) {
      if (err !== null) {
        console.log(err);
        return res.status(500).json({});
      } else {
        return res.status(200).json({});
      }
    });
  },

  //PATCH /rentals/check_in(cust id, movie title)
  // adding returned date
  update: function(req, res) {

  }
};
