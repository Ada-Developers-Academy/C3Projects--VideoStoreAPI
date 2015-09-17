"use strict";

exports.moviesController = {
  database_test: function(req, res) {
    var db = new Database(); // instantiates Database object
    db.test();

    return res.status(200).json(results);
  },
}
