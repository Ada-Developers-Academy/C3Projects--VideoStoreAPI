"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env  = process.env.DB || 'development',
    db;

function addPercents(variable) {
    var percented = "%" + variable + "%";
    return percented;
  }

function findCopy(movie_title, callback) {
  db = new sqlite3.Database('db/' + db_env + '.db');
  // old statement
  // "SELECT rentals.movie_copy_id, movies.id FROM rentals \
  //         INNER JOIN movie_copies ON rentals.movie_copy_id = movie_copies.id \
  //         INNER JOIN movies ON movie_copies.movie_id = movies.id \
  //         WHERE movies.title LIKE ? AND (rentals.return_status = 1 OR rentals.id IS NULL) \
  //         ORDER BY rentals.return_date DESC;"

  db.get("SELECT movie_copies.id FROM movie_copies \
          INNER JOIN movies ON movie_copies.movie_id = movies.id \
          WHERE movies.title LIKE ? AND movie_copies.is_available = 1;", movie_title, function(err, result) {
            if (err) {
              console.log("ERROR:", err);
            }
          db.close();
    if(err) {
      // return res.status(204).json("No copies available");
      console.log("ERROR: ", err);
    }
    else {
      // var movie_data = result;
      console.log("MOVIE DATA: ", result);
      callback(result);
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
    var checkout = new Date();
    var due = new Date(checkout);
    due.setDate(checkout.getDate()+7);
    checkout = checkout.toISOString().split("T")[0];
    due = due.toISOString().split("T")[0];

    findCopy(movie, function(movie_data) {
      console.log("COPY ID: ", movie_data.id);

      db = new sqlite3.Database('db/' + db_env + '.db');
      db.run("INSERT INTO rentals(customer_id, movie_copy_id, checkout_date, return_date, return_status, cost) \
      VALUES(" + customer + ", " + movie_data.id + ", " + checkout + ", " + due + ", 0, 5); \
      COMMIT;", function(err, result) {
        db.close();
        return res.status(200).json(result);
      });
    });

    // INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
    // VALUES('Shelley Rocha', '2015-09-21', '123 Nope St', 'Seattle', 'WA', '98104', '(000) 000-000', '100'), \
    //       ('Billy Rocha', '2015-09-21', '123 Nope St', 'Seattle', 'WA', '98104', '(000) 000-000', '100'); \
    // COMMIT;", function(err) {



  },

};
