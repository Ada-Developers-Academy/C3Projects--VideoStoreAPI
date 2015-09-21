"use strict";
    var Customer = require('../models/customers');

exports.rentalsController = {
  /*
  GET /rentals/overdue
  movies and the customer associated with it

  GET /rentals/checkout_out

  POST /rentals/check_out(cust id, movie title) (math for checkout cost)
  // creating a new rental with no returned date

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
