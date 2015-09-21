"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env  = process.env.DB || 'development',
    db;

function addPercents(variable) {
    var percented = "%" + variable + "%";
    return percented;
  }

function findCopy(movie_title) {
  db = new sqlite3.Database('db/' + db_env + '.db');
  db.get("SELECT movie_copies.id FROM rentals \
          INNER JOIN movie_copies ON rentals.movie_copy_id = movie_copies.id \
          INNER JOIN movies ON movie_copies.movie_id = movies.id \
          WHERE rentals.return_status = 1 AND movies.title LIKE ?;", movie_title, function(err, rental) {
          db.close();
    if(err) {
      return res.status(204).json("No copies available");
    }
    else {
      console.log("from find copy " + rental);
      return rental.id;
    }
  });
}

exports.rentalsController = {
  rentals: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    db.all("SELECT * FROM rentals", function(err, all_rentals) {
      db.close();
      return res.status(200).json(all_rentals);
    });
  },

  overdue_rentals: function(req, res) {
    var current_date = new Date(); // get current date
    current_date = current_date.toISOString(); // change format to YYY-MM-DD and time
    var formatted_current_date = current_date.split("T")[0]; // cut off time

    db = new sqlite3.Database('db/' + db_env + '.db');
    db.all("SELECT customers.name, movies.title, movie_copies.id FROM rentals \
            INNER JOIN movie_copies ON rentals.movie_copy_id = movie_copies.id \
            INNER JOIN movies ON movie_copies.movie_id = movies.id \
            INNER JOIN customers ON rentals.customer_id = customers.id \
            WHERE rentals.return_status = 0 AND rentals.return_date < ?;", formatted_current_date, function(err, all_rentals) {
      db.close();
      return res.status(200).json(all_rentals);
    });
  },

  create_rental: function(req, res) {
    var customer = req.params.customer_id,
        movie = req.params.movie_title;
        movie = addPercents(movie);
        console.log(movie);
        console.log(customer);
    var copy_id = findCopy(movie);
    console.log("from create_rental " + copy_id);

    // db = new sqlite3.Database('db/' + db_env + '.db');
    // db.run("SELECT * FROM rentals", function(err, all_rentals) {
    //   db.close();
      // return res.status(200).json(all_rentals);
    // });
  },

};

