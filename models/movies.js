"use strict";

module.exports = {

  function Movie() {
   this.table_name = "movies";
  },

  Movie.prototype = require("./database");

  Movie.prototype.movie_info = function(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db'),
    results = [],
    value = '%' + title + '%',
    statement = "SELECT movies.title, movies.overview, movies.inventory FROM movies, rentals WHERE movies.title LIKE ? AND movies.title=rentals.movie_title AND rentals.return_date IS NULL;",
    all_statement = "SELECT movies.title, movies.overview, movies.inventory FROM movies WHERE movies.title LIKE ?;";

    db.serialize(function() {
      db.all(statement, [value], function(err, res) {
        if (callback) callback(err, res);
        db.close();
        var rented  = res.length,
            movie = res[0];

      })
    })
  }
  movie_available: function movie_available(req,res) {



        db.serialize(function() {
          db.all(statement, [titleish], function(err, rows) {
            var rented = rows.length,
                movie = rows[0];
              if (movie == undefined) {
                db.all(all_statement, [titleish], function(err, rows) {
                  var movie = rows[0],
                      available = movie.inventory;
                results.push(movie, {'Available': available});
                db.close();
                return res.status(200).json(results);
                });
              } else {
                var available = movie.inventory - rented;
                results.push(movie, {'Available': available});
                db.close();
                return res.status(200).json(results);
              }
          });
        });
    }


}
