var express = require('express');
var router = express.Router();

// open a connection to the db
var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');
// run a SQL statement to retrieve the data

// serve that data as json at that endpoint

/* GET list of movies */
router.get('/', function(req, res, next) {
  db.all("SELECT title FROM movies;", function(err, rows) {
    rows.forEach(function(row) {
      console.log(row.title);
    })
  });
  return res.status(200).json({ message: "all the movies!" });
});

module.exports = router;