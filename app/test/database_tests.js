var assert = require("assert");
var Database = require("../database");

describe("Database", function () {
  var db;

  beforeEach(function() {
    db = new Database();
  });

  it("can be instantiated", function() {
    assert.equal(db instanceof Database, true)
  });

  it("has a 'query' property that is a function", function() {
    assert.equal(typeof db.query, "function");
  });

});
