"use strict";
var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');
var Movie = require('../models/movies');
var Customer = require('../models/customers');
var Rental = require('../models/rentals');

// Convert a JavaScript Date to a string in yyyymmdd format
function yyyymmdd(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
  var dd = date.getDate().toString();
  return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
}

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

  // GET /rentals/:title/available_inventory
  getMovieAvailableInventory:function(title, res) {
    db.all("SELECT movies.title, movies.inventory-(SELECT COUNT(*) from rentals  WHERE rentals.movie_id=movies.id AND check_in_date IS NULL) AS available from movies WHERE title LIKE ?", title, function(err, rows) {
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

  // PATCH rentals/check_in?id=XXX&title=XXX
  checkIn:function(id, title, res) {
    var now = new Date();
    var late_fee = 3;
    var statement = "SELECT id FROM rentals WHERE customer_id=? \
      AND movie_id=(SELECT id FROM movies where title LIKE ?) \
      AND check_in_date IS NULL;"

    db.all(statement, id, title, function(err, result1) {
      console.log(result1);
      // if (result == []) {
      //   res.status(404).json([]);
      // }
      // else {
        var statement_oldest = "UPDATE rentals SET check_in_date=? WHERE id=" + result1[0].id;
        db.all(statement_oldest, yyyymmdd(now), function(err, result2) {
          if (err !== null) {
            console.log(err);
          } else {
            var statement_late_fee = "UPDATE customers SET account_credit=(account_credit-" + late_fee + ") WHERE id=? AND date((SELECT expected_return_date FROM rentals WHERE id=?)) < date('now');";

            db.run(statement_late_fee, id, result1[0].id, function(err, result3) {
              if (err !== null) {
                console.log(err);
              }
              else {
                res.status(200).json([]);
              }
            });
          }
        })
      // }
    })
  },

  // POST /rentals/check_out(cust id, movie title) (math for checkout cost)
  // creating a new rental with no returned date
  checkOut:function(req, res) {
    var data = req["body"];
    var db = new Customer();

    db.check_out(data, function(err, result) {
      if (err !== null) {
        console.log(err);
        return res.status(500).json(result);
      } else {
        return res.status(200).json(result);
      }
    });
  }
};
