"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development';

exports.moviesController = {
  index: function index(req, res, callback) {
    var db = new sqlite3.Database('./db/' + db_env + '.db');
    var statement = "SELECT * from movies;";
    var results = [];
      db.all(statement, function(err, rows) {
        rows.forEach(function (row) {
          results.push(row);
        });
        db.close();
        return res.status(200).json(results);
      });
  },

  title: function title(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db');
    var results = [];
    var records = req.params.records,
        offset = req.params.offset;
    var statement = "SELECT * FROM movies ORDER BY title LIMIT ? OFFSET ? ;";
      db.all(statement, [records, offset], function(err, rows) {
        rows.forEach(function (row) {
          results.push(row);
        });
        db.close();
        return res.status(200).json(results);
      });
  },

  released: function released(req,res) {
    var db = new sqlite3.Database('./db/' + db_env + '.db');
    var results = [];
    var records = req.params.records,
        offset = req.params.offset;
    var statement = "SELECT * FROM movies ORDER BY release_date DESC LIMIT ? OFFSET ? ;";
      db.all(statement, [records, offset], function(err, rows) {
        rows.forEach(function (row) {
          results.push(row);
        });
        db.close();
        return res.status(200).json(results);
      });
  },

  checkedout: function checkedout(req,res) {
    var results = {
      // for a movie, all customers w/ it checked out
    }
  return res.status(200).json(results);
  },

  title_history: function title_history(req,res) {
    var results = {
      // for a movie, all customers w/ that movie previously checked out
      // sorted by check out date
    }
  return res.status(200).json(results);
  },

  id_history: function id_history(req,res) {
    var results = {
      // for a movie, all customers w/ that movie previously checked out
      // sorted by
    }
  return res.status(200).json(results);
  },

  name_history: function name_history(req,res) {
    var results = {
      // for a movie, all customers w/ that movie previously checked out
      // sorted by
    }
  return res.status(200).json(results);
  }
}
