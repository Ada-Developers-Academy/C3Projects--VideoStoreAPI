"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db = new sqlite3.Database('db/' + db_env + '.db');

  var movies =  require('./movies');
  var movie_statement = db.prepare(
    "INSERT INTO movies(title, overview, release_date, inventory) \
    VALUES (?, ?, ?, ?);"
  );

  db.serialize(function() {
    for(var i = 0; i < movies.length; i++) {
      var movie = movies[i];
      movie_statement.run(
        movie.title,
        movie.overview,
        movie.release_date,
        movie.inventory
      );
    }
  })
  //loop through movies
  //insert each into db

db.close();
