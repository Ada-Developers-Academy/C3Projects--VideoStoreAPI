"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');

// var assert = require("assert");
//
// describe("moviesController", function(){
//
// })

// var assert = require("assert");
// describe('Array', function() {
//   describe('#indexOf()', function () {
//     it('should return -1 when the value is not present', function () {
//       assert.equal(-1, [1,2,3].indexOf(5));
//       assert.equal(-1, [1,2,3].indexOf(0));
//     });
//   });
// });


var assert = require("assert");
describe("moviesController", function() {
  var moviesController = null

  beforeEach(function() {

  })

  it("GET all movies at endpoint /movies", function() {

    db.all("SELECT title, overview, release_date, inventory FROM movies", function(err, rows) {
      assert.equal(err, null);

      // Make HTTP request to /movies and compare the returned data with
      // the data from the DB (rows)

    });
  })

  it("has a `test` property that is a function", function() {
    assert.equal(typeof db.test, "function");
  })

  it("holds onto the `path` to the database", function() {
    assert.equal(db.path, database_path);
  })

  describe("`query` function", function() {
    before(function() {
      // create a users table
      db.query("CREATE TABLE IF NOT EXISTS users (name TEXT);");

      // insert some users
    })

    it("has a users table", function(done) {
      var table_exists = "SELECT count(*) AS table_count FROM sqlite_master WHERE type='table' AND name='users'; ";

      db.query(table_exists, function(result) {
        assert.equal(result[0].table_count, 1);
        done();
      });
    })
  })
})
