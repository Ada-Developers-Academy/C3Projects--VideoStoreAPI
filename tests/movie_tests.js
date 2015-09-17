// var assert = require('assert');
// var moviesController = require('../controllers/movies_controller.js');

// describe("Database", function() {
//   var db;
//   var database_path = "db/test.db";

//   beforeEach(function() {
//     db = new Database(database_path);
//   });

//   it("can be instantiated", function() {
//     // assert.equal(db instanceof Database, true);
//     assert.equal(Object.getPrototypeOf(db), Database.prototype);
//   });

//   it("has a `test` property that is a function", function() {
//     assert.equal(typeof db.test, "function");
//   });

//   it("holds onto the `path` to the database", function() {
//     assert.equal(db.path, database_path);
//   });

//   describe("User queries", function() {
//     before(function() {
//       // create a users table
//       db.query("CREATE TABLE IF NOT EXISTS users (name TEXT);");
//       // insert some users

//     })

//     it("has a users table", function(done) {
//       var table_exists = "SELECT count(*) AS table_count FROM sqlite_master WHERE type='table' AND name='users';";
//       db.query(table_exists, function(result) {
//         assert.equal(result[0].table_count, 1);
//         done();
//       });
//     })
//   })
// })
