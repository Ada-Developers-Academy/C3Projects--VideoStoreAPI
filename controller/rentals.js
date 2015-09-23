"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');

exports.rentalsController = {
  // '/rentals/:title/current/:sort_option'
  current_rentals: function(req, res) {
    var statement = "SELECT * FROM movies WHERE title LIKE '%" + req.params.title + "%';";

    db.all(statement, function(err, rows) {
      var movieId = rows[0].id;

      var statement = "SELECT * FROM rentals WHERE movie_id = " + movieId + " AND return_date = '' ORDER BY " + req.params.sort_option + ";";

      db.all(statement, function(err, rows) {
        res.status(200).json(rows);
      });
    });
  },

  // '/rentals/:title/past/:sort_option'
  past_rentals: function(req, res) {
    var statement = "SELECT * FROM movies WHERE title LIKE '%" + req.params.title + "%';";

    db.all(statement, function(err, rows) {
      var movieId = rows[0].id;

      var statement = "SELECT * FROM rentals WHERE movie_id = " + movieId + " AND return_date != '' ORDER BY " + req.params.sort_option + ";";

      db.all(statement, function(err, rows) {
        res.status(200).json(rows);
      });
    });
  },

  // '/rentals/overdue'
  overdue: function(req, res) {
    db.all("SELECT * FROM rentals;", function(err, rows) {
      var overdue = [];

      for(var i = 0; i < rows.length; i++) {
        var returnDate = rows[i].return_date == "" ? new Date() : new Date(rows[i].return_date);
        var dueDate = new Date(rows[i].due_date);

        if (returnDate > dueDate) {
          overdue.push(rows[i]);
        }
      }
      res.status(200).json(overdue);
    });
  },

  // *GET*  rental/:title/available
  check_inventory: function(req, res) {
    var statement = "SELECT * FROM movies WHERE title LIKE '%" + req.params.title + "%';";

    db.all(statement, function(err, rows) {
      var inventory = { "title"    : rows[0].title,
                        "inventory_available": rows[0].inventory_available
                      }

      res.status(200).json(inventory);
    });
  },

  // *POST* rental/:title/:customer_id/checkin
  checkin: function(req, res) {
  // find rental entry by searchng with customer_id and movie title
    var statement = "SELECT * FROM movies WHERE title LIKE '%" + req.params.title + "%';";

    db.all(statement, function(err, rows){
      // rows is specific movie
      var movieId = rows[0].id;
      var newInventory = parseInt(rows[0].inventory_available) + 1;
      var updateMovieStatement = "UPDATE movies SET inventory_available=? WHERE id=? ;";
      var customerId = req.params.customer_id;
      // update movie inventory_available (+1)
      db.run(updateMovieStatement, newInventory, movieId, function(err, rows) {

        var statement = "SELECT * FROM rentals WHERE customer_id = " + customerId + " AND movie_id = " + movieId + " AND return_date = '';";

        db.all(statement, function(err, rows){
          // rows is specific rental entry
          var rentalId = rows[0].id;
          // change return_date to current date
          var returnDate = new Date();
          var dueDate = new Date(rows[0].due_date);

          var updateRentalStatement = "UPDATE rentals SET return_date=? WHERE id=? ;";
          db.run(updateRentalStatement, returnDate.toString(), rentalId, function(err, rows) {
            // if return_date is > due_date, charge $1 per day late fee
            if (returnDate > dueDate){
              // converting milliseconds to days the brute force way :(
              var lateFee = parseInt((returnDate - dueDate)/1000/60/60/24);
              var customerStatement = "SELECT * FROM customers WHERE id = " + customerId + ";";

              db.all(customerStatement, function(err, rows){
                var updatedCredit = parseInt(rows[0].credit) - lateFee;
                var updateCustomerStatement = "UPDATE customers SET credit=? WHERE id=?;";

                db.run(updateCustomerStatement, updatedCredit, customerId, function(err, rows){
                  res.status(200).json('Movie checked in. Charged late fee.');
                });
              });
            } else {
              res.status(200).json('Movie checked in.');
            }
          });
        });
      });
    });
  },


  // *POST* rental/:title/:customer_id/checkout
  checkout: function(req, res){
   // select from movies the title to find movie_id
    var statement = "SELECT * FROM movies WHERE title LIKE '%" + req.params.title + "%';";

    db.all(statement, function(err, rows){
      // rows is specific movie, get id
      // update movie inventory_available (-1)
      var movieId = rows[0].id;
      var newInventory = parseInt(rows[0].inventory_available) - 1;


      // create new rental entry
      var statement = "INSERT INTO rentals VALUES (?, ?, ?, ?, ?);";
      var customerId = req.params.customer_id;
      var returnDate = '';
      var checkoutDate = new Date();
      var dueDate = new Date(checkoutDate);
      dueDate.setDate(checkoutDate.getDate() + 7);


      db.run(statement, customerId, movieId, returnDate, (checkoutDate).toString(), (dueDate).toString(), function(err, rows){

        var updateMovieStatement = "UPDATE movies SET inventory_available=? WHERE id=? ;";
        // update movie inventory_available (+1)
        db.run(updateMovieStatement, newInventory, movieId, function(err, rows) {

          var customerStatement = "SELECT * FROM customers WHERE id = " + customerId + ";";

          db.all(customerStatement, function(err, rows){
            // subtract $1 from customer's credit
            var updateCustomerStatement = "UPDATE customers SET credit=? WHERE id=?;"
            var updatedCredit = parseFloat(rows[0].credit) - 1;

            db.run(updateCustomerStatement, updatedCredit, customerId, function(err, rows) {
              res.status(200).json('Movie checked out.');
            })
          });
        });
      });
    });
  }
}
