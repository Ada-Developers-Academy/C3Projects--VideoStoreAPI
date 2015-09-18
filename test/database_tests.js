var assert = require("assert");
var Database = require("../database");

describe("Database", function () {
  var db;
  var database_path = "db/test.db";

  beforeEach(function() {
    db = new Database(database_path);
  });

  it("can be instantiated", function() {
    assert.equal(db instanceof Database, true);
  });

  it("holds onto the 'path' to the database", function() {
    assert.equal(db.path, database_path);
  });

  it("has a 'query' property that is a function", function() {
    assert.equal(typeof db.query, "function");
  });

  // describe("Movie queries", function() {
  //   before(function() {
  //     // create a movies table
  //     db.query("CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY, title TEXT);");
  //     // insert some movies
  //     db.query("INSERT INTO movies(title) VALUES('Lockjaw');");
  //   });
  //
  //   it("has a movies table", function(done) {
  //     var table_exists = "SELECT count(*) AS table_count FROM sqlite_master WHERE type='table' AND name='movies';";
  //
  //     db.query(table_exists, function(result) {
  //       assert.equal(result[0].table_count, 1);
  //       done();
  //     });
  //   });
  // });

});
