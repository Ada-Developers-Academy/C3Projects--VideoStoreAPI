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
      var newInventory = parseInt(rows[0].current_inventory) + 1;
      var updateMovieStatement = "UPDATE movies SET current_inventory=? WHERE id=? ;";
      // update movie inventory_available (+1)
      db.run(updateMovieStatement, newInventory, movieId, function(err, rows) {

        var statement = "SELECT * FROM rentals WHERE customer_id = " + req.params.customer_id + " AND movie_id = " + movieId + " AND return_date = '';";

        db.all(statement, function(err, rows){
          // rows is specific rental entry
          var rentalId = rows[0].id;
          // change return_date to current date
          var updateRentalStatement = "UPDATE rentals SET return_date=? WHERE id=? ;";

          db.run(updateRentalStatement, (new Date()).toString(), rentalId, function(err, rows) {
            res.status(200).json('success');
          })
        });
      })
    });
  },


  // *POST* rental/:title/:customer_id/checkout
  checkout: function(req,res){
   // select from movies the title to fid movie_id
    var statement = "SELECT * FROM movies WHERE title LIKE '%" + req.params.title + "%';";

    db.all(statement, function(err, rows){
      // rows is specific movie, get id 
      // update movie inventory_available (-1)
      var movieId = rows[0].id;
      var newInventory = parseInt(rows[0].current_inventory) - 1;


      // create new rental entry
      var statement = "INSERT INTO rentals VALUES (?, ?, ?, ?, ?);";
      var customerId = req.params.customer_id;
      var returnDate = '';
      var checkoutDate = new Date();
      var dueDate = new Date(checkoutDate);
      dueDate.setDate(checkoutDate.getDate() + 7);


     db.run(statement, customerId, movieId, returnDate, (checkoutDate).toString(), (dueDate).toString(), function(err, rows){
        
        var updateMovieStatement = "UPDATE movies SET current_inventory=? WHERE id=? ;";
        // update movie inventory_available (+1)
        db.run(updateMovieStatement, newInventory, movieId, function(err, rows) {
        res.status(200).json('success');  
        });
      });
    });
  },
  //  ['customer_id', 'integer'] -> in params
  //  ['movie_id', 'integer'], -> will need to find
  //  ['return_date', 'text'], -> ''
  //  ['checkout_date', 'text'], -> today's date
  //  ['due_date', 'text'] -> today's date + 7 days
  // subtract $1 from customer's credit
}
