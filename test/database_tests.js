var assert = require("assert");
var Database = require('../database');

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db = new sqlite3.Database('db/' + db_env + '.db');


describe("Database", function() {
  // "Hoisting" the db var into a higher scope
  // However all tests will be using the same object
  var db; // could also be db = null
  var database_path = "db/test.db"
  beforeEach(function() {
    db = new Database(database_path);
  })

  it("can be instantiated", function() {
    // var db = new Database();
    assert.equal(db instanceof Database, true);
  })

  it("has a test property", function() {
    // var db = new Database();
    assert.equal(typeof db.test, "function")
  })

  it("holds onto the `path` of the database", function() {
    assert.equal(db.path, database_path);
  })

  describe("user queries", function(){
    before(function() {
      // create a users table
      db.query("CREATE TABLE IF NOT EXISTS users (name TEXT);");


      // insert users
    })

    it("has a users table", function(done) {
      var table_exists = "SELECT count(*) AS table_count FROM sqlite_master WHERE type='table' AND name='users';";
      // var result = db.query(table_exists);
      db.query(table_exists, function(result) {
        assert.equal(result[0].table_count, 1);
        done(); // this MUST be here
      })
    })
  })
})
