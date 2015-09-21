"use strict";

var assert = require("assert");
var Database = require('../../models/database');

describe("Database", function() {
  var db;
  var dbPath = "db/test.db";

  beforeEach(function(done) {
    db = new Database();
    done();
  });

  it("can be instantiated", function() {
    assert.equal(db instanceof Database, true);
  });

  it("holds onto the `path` to the database", function() {
    assert.equal(db.dbPath(), dbPath);
  });
});
