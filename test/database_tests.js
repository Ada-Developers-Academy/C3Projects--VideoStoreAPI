var assert = require("assert");
var Database = require("../database"); // our database.js file

describe("Database", function() {
  var db;
  var database_path = "db/test.db";

  beforeEach(function() {
    db = new Database(database_path);
  });

  it("can be instantiated", function() {
    assert.equal(db instanceof Database, true);
  });

  it("has a 'query' property that is a function", function() {
    assert.equal(typeof db.query, "function");
  });

  it("holds onto the 'path' to the database", function() {
    assert.equal(db.path, database_path);
  });

  // describe("'query' function", function() {
  //   before(function() {
  //     // create a customers table
  //     db.query("CREATE TABLE IF NOT EXISTS customers (name TEXT);");

  //     // insert some customers
  //   });

  //   it("has a customers table", function(done) {
  //     var table_exists = "SELECT count(*) AS table_count FROM sqlite_master WHERE type='table' AND name='customers'; ";

  //     db.query(table_exists, function(result) {
  //       assert.equal(result[0].table_count, 1);
  //       done();
  //     });
  //   });
  // });
});