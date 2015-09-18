"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env  = process.env.DB || 'development',
    db;

function addPercents(variable) {
  var percented = "%" + variable + "%";
  return percented;
}

exports.customersController = {
  customers: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    db.all("SELECT * FROM customers", function(err, all_customers) {
      db.close();
      return res.status(200).json(all_customers);
    });
  },

  customers_by_name: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var name = req.params.name;
    name = addPercents(name);
    db.get("SELECT * FROM customers WHERE name LIKE ?;", name, function(err, the_name) {
      db.close();
      console.log(arguments);
      return res.status(200).json(the_name);
    });

  },

  customers_by_register_date: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var date = req.params.date;
    date = addPercents(date);
    db.get("SELECT * FROM customers WHERE registered_at LIKE ?;", date, function(err, the_date) {
      db.close();
      return res.status(200).json(the_date);
    });

  },

  customers_by_postal_code: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var zipcode = req.params.zipcode;
    zipcode = addPercents(zipcode);
    db.get("SELECT * FROM customers WHERE postal_code LIKE ?;", zipcode, function(err, the_code) {
      db.close();
      return res.status(200).json(the_code);
    });

  },

};
