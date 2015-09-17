var assert = require("assert");
var Database = require('../database');

describe("Database", function() {
  var db;
  var database_path = "db/test.db"

  beforeEach(function() {
    db = new Database(database_path);
  })

  it("can be instantiated", function() {
    assert.equal(db instanceof Database, true);
  })

  it("has a `test` property that is a function", function() {
    assert.equal(typeof db.test, "function");
  })

  it("holds on to the path to the database", function() {
    assert.equal(db.path, database_path);
  })

  describe("User queries", function() {
    before(function() {
      //create users table
      db.query("Create table if not exists users (name TEXT);");
    })

    it("has a users table", function(done) {
      var table_exists = "Select count(*) as table_count from sqlite_master where type='table' AND name='users';";

      db.query(table_exists, function(result) {
        assert.equal(result[0].table_count, 1);
        done();
      });
    });
  })
})
