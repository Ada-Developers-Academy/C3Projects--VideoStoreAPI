"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env  = process.env.DB || 'development',
    db;


exports.customersController = {
  customers: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    db.all("SELECT * FROM customers", function(err, all_customers) {
      db.close();
      return res.status(200).json(all_customers);
    });
  }
};
