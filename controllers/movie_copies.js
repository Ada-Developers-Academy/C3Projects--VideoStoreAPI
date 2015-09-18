"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env  = process.env.DB || 'development',
    db;


exports.movie_copiesController = {
  copies: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    db.all("SELECT * FROM movie_copies", function(err, all_copies) {
      db.close();
      return res.status(200).json(all_copies);
    });

  }

}; // end exports.moviesController
