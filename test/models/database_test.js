var assert = require("assert");
var Database = require('../../models/database');

describe("Database", function() {
  var db;
  var dbPath = "db/test.db";

  beforeEach(function() {
    db = new Database(dbPath);
  });

  it("can be instantiated", function() {
    assert.equal(db instanceof Database, true);
  });

  it("holds onto the `path` to the database", function() {
    assert.equal(db.path, dbPath);
  });

  describe("#create", function() {
    it("creates a new movie record", function(done) {
      var data = {
       title: "RoboJaws",
       overview: "Jaws is hunted by RoboJaws",
       release_date: "Tomorrow",
       inventory: 10
     }

      db.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.insertedID, 1);
        assert.equal(res.changed, 1);
        done();
      });
    });
  });
});
