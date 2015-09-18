var assert = require("assert");
var Movie = require('../../models/movie');

describe("Movie", function() {

  it("has a find_by property that is a function", function() {
    var movie = new Movie();
    assert.equal(typeof movie.find_by, "function");
  });
});
