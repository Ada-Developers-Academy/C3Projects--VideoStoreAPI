"use strict";
    var Customer = require('../models/customers');

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');
var Movie = require('../models/rentals');

exports.rentalsController = {
  // GET /rentals
  getAllRentals: function(res) {
    db.all("SELECT * FROM rentals ", function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // GET /rentals/overdue
  // movies and the customer associated with it
  getAllOverdue:function(res) {
    db.all("SELECT customers.name, movies.title FROM rentals INNER JOIN customers on customers.id = rentals.customer_id INNER JOIN movies on movies.id = rentals.movie_id WHERE check_in_date IS NULL; ", function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // GET /rentals/checkout_out
  getAllCurrentlyOut:function(res) {
    db.all("SELECT customers.name, movies.title FROM rentals INNER JOIN customers on customers.id = rentals.customer_id INNER JOIN movies on movies.id = rentals.movie_id WHERE check_in_date IS NOT NULL; ", function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },
  /*

  POST /rentals/check_out(cust id, movie title) (math for checkout cost)
  // creating a new rental with no returned date

  restapi.post('/data', function(req, res){
    db.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter", function(err, row){
        if (err){
            console.err(err);
            res.status(500);
        }
        else {
            res.status(202);
        }
        res.end();
    });
});

  PATCH /rentals/check_in(cust id, movie title)
  // adding returned date
  */

  create: function(req, res) {
    console.log(req["req"]["body"]);

    // return res.status(200).json(req["req"]["body"]);
    // return res.redirect('index', { title: 'Express' });

    var data = req["req"]["body"]

    var db = new Customer();
    db.create(data, function(err, result) {
      console.log("DONE");
    });

    // if (req.method == 'POST') {
    //   var body = req.body;
      // req.on('data', function (data) {
      //   body += data;
      //
      //   // Too much POST data, kill the connection!
      //   if (body.length > 1e6)
      //       request.connection.destroy();
      // });
      // req.on('end', function () {
      //   var post = qs.parse(body);
      //
      //   // use post['blah'], etc.
      // });
    // }
  }
};
