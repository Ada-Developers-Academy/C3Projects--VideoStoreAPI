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
  }
}
