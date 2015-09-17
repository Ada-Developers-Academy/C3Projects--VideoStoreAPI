var express = require('express');
var router = express.Router();

// open a connection to the db
var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

/* GET list of movies */
router.get('/', function(req, res, next) {
  // run a SQL statement to retrieve the data
  db.all("SELECT title FROM movies;", function(err, rows) {
    // serve that data as json at that endpoint
    res.status(200).json({ movies: rows });

    db.close();
  });
});

module.exports = router;
