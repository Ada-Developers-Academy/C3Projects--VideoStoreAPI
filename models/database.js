"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development';

module.exports = {

  all: function(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name;

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  some: function(column, limit, offset, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + " ORDER BY " + column +
        " LIMIT " + limit + " OFFSET " + offset;

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    })
  },

  find_by: function(column, query, value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db'),
        statement = "SELECT * FROM rentals WHERE " + column + "=? AND " + query;

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  movie_available: function(title, callback) {
    var db = new sqlite3.Database('./db/' + db_env + '.db'),
        titleish = '%' + title + '%',
       // need to account for movies that may not have rentals and movies with titleish matches
      statement = "SELECT movies.title, movies.overview, movies.inventory FROM movies, rentals WHERE movies.title LIKE ? AND movies.title=rentals.movie_title AND rentals.return_date IS NULL;",
      all_statement = "SELECT movies.title, movies.overview, movies.inventory FROM movies WHERE movies.title LIKE ?;";

      db.serialize(function() {
        db.all(statement, [titleish], function(err, res) {
          var rented = res.length,
              results = [],
              movie = res[0];

              // console.log(res);
            if (movie == undefined) {
              db.all(all_statement, [titleish], function(err, res) {
                var movie = res[0],
                    available = movie.inventory;
              results.push(movie, {'Available': available});
              if (callback) callback(err, results);
              db.close();
              });
            } else {
              var available = movie.inventory - rented;
              results.push(movie, {'Available': available});
              if (callback) callback(err, results);
              db.close();
            }
        });
      });
   }
}
