var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe.only("movies controller", function() {
  describe("GET ':title/customers/current'", function() {
    it("knows about the route", function(done) {
      agent.get('/Jaws/customers/current').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        })
    })
  })
})
