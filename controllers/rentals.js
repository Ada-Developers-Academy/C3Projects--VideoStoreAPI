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

  db.get("SELECT movie_copies.id FROM movie_copies \
          INNER JOIN movies ON movie_copies.movie_id = movies.id \
          WHERE movies.title LIKE ? AND movie_copies.is_available = 1;",
    movie_title, function(err, result) {
      if (err) {
        db.close();
        return ("NO COPIES AVAILABLE ", err);
      }
      else {
        db.close();
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

    findCopy(movie, function(movie_copy) {
      if(movie_copy === undefined) {
        return res.status(204).send({status: 204, message: "NO COPIES AVAILABLE"});
      }

      db = new sqlite3.Database('db/' + db_env + '.db');
      db.serialize(function() {
        db.run("INSERT INTO rentals(customer_id, movie_copy_id, checkout_date, return_date, return_status, cost) \
                VALUES(" + customer + ", " + movie_copy.id + ", '" + checkout + "', '" + due + "', 0, 5); \
                COMMIT;", function(err, result) {
            if (err) {
              console.log("ERROR: ", err);
            }
            return res.status(200).json(result);
          }); // end first db.run
          db.run("UPDATE customers SET account_credit = account_credit - 5 WHERE id = " + customer + ";");
          db.run("UPDATE movie_copies SET is_available = 0 WHERE id = " + movie_copy.id + ";");
        });
        db.close();
      });
  }
};
