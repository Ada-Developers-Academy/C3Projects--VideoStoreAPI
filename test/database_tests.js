"use strict";

var assert = require("assert");
var Database = require('../database');

describe("Database", function(){
  var db;
  var database_path = "db/development.db";

  beforeEach(function(){
    db = newDatabase(database_path);
  })

  it("can be instantiated", function(){
    assert.equal(db instanceof Database, true);
  })

  it("has a `test` property that is a function", function(){
    assert.equal(typeof db.test, "function");
  })

  it("holds onto the `path` to the database", function(){
    assert.equal(db.path, database_path);
  })
})
